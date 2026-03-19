#!/bin/bash
# deploy.sh — SuperClaw101 部署脚本
# Usage: ./deploy.sh [--build] [--serve] [--tailscale] [--all]
# 
# Prerequisites:
#   - Node.js 18+
#   - Tailscale (for HTTPS expose)
#   - sudo access (for tailscale serve)

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$PROJECT_DIR/dist"
SERVE_PORT=3001
SERVE_PID_FILE="/tmp/superclaw101-serve.pid"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[deploy]${NC} $*"; }
warn() { echo -e "${YELLOW}[warn]${NC} $*"; }
err()  { echo -e "${RED}[error]${NC} $*"; exit 1; }

# ---- Step 1: Build ----
build() {
    log "Building Astro site..."
    cd "$PROJECT_DIR"
    npx astro build
    PAGES=$(find dist -name "*.html" | wc -l)
    SIZE=$(du -sh dist | cut -f1)
    log "Build complete: $PAGES pages, $SIZE"
}

# ---- Step 2: Serve via npx serve ----
serve() {
    # Kill previous instance if running
    if [ -f "$SERVE_PID_FILE" ]; then
        OLD_PID=$(cat "$SERVE_PID_FILE")
        if kill -0 "$OLD_PID" 2>/dev/null; then
            log "Stopping previous serve (PID $OLD_PID)..."
            kill "$OLD_PID" 2>/dev/null || true
            sleep 1
        fi
        rm -f "$SERVE_PID_FILE"
    fi

    # Check if port is in use
    if ss -tlnp | grep -q ":${SERVE_PORT} "; then
        EXISTING_PID=$(ss -tlnp | grep ":${SERVE_PORT} " | grep -oP 'pid=\K[0-9]+' | head -1)
        if [ -n "$EXISTING_PID" ]; then
            log "Port $SERVE_PORT already in use by PID $EXISTING_PID, killing..."
            kill "$EXISTING_PID" 2>/dev/null || true
            sleep 2
        fi
    fi

    log "Starting serve on port $SERVE_PORT..."
    cd "$PROJECT_DIR"
    nohup npx serve dist -l "$SERVE_PORT" --no-clipboard > /tmp/superclaw101-serve.log 2>&1 &
    echo $! > "$SERVE_PID_FILE"
    sleep 2

    # Verify
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SERVE_PORT/" | grep -q "200"; then
        log "✅ Server running at http://localhost:$SERVE_PORT/"
    else
        err "Server failed to start. Check /tmp/superclaw101-serve.log"
    fi
}

# ---- Step 3: Tailscale Serve (requires sudo) ----
tailscale_serve() {
    if ! command -v tailscale &>/dev/null; then
        err "tailscale not installed"
    fi

    log "Setting up Tailscale Serve on port $SERVE_PORT..."
    
    # One-time operator setup (needs sudo)
    if ! tailscale status 2>&1 | grep -q "serve config"; then
        log "Note: First-time setup needs sudo to set operator:"
        log "  sudo tailscale set --operator=\$USER"
    fi

    # Apply serve config
    sudo tailscale serve --bg "$SERVE_PORT" 2>&1 && \
        log "✅ Tailscale Serve configured" || \
        warn "Tailscale Serve failed — needs sudo. Run manually:"
    warn "  sudo tailscale serve --bg $SERVE_PORT"

    # Show status
    echo ""
    tailscale serve status 2>&1 || true
    echo ""
    TS_HOSTNAME=$(tailscale status --self 2>/dev/null | awk '{print $2}')
    log "Tailscale URL: https://${TS_HOSTNAME:-<hostname>}/"
}

# ---- Step 4: Tailscale Funnel (public, requires sudo) ----
tailscale_funnel() {
    log "Setting up Tailscale Funnel (public internet)..."
    sudo tailscale funnel --bg "$SERVE_PORT" 2>&1 && \
        log "✅ Tailscale Funnel active (public)" || \
        warn "Funnel failed — needs sudo. Run: sudo tailscale funnel --bg $SERVE_PORT"
}

# ---- Step 5: Verify ----
verify() {
    log "Verifying deployment..."
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SERVE_PORT/")
    
    if [ "$HTTP_CODE" = "200" ]; then
        PAGES=$(find dist -name "*.html" | wc -l)
        TS_HOSTNAME=$(tailscale status --self 2>/dev/null | awk '{print $2}')
        echo ""
        log "=========================================="
        log "  SuperClaw101 Deployment Summary"
        log "=========================================="
        log "  Pages:     $PAGES"
        log "  Size:      $(du -sh dist | cut -f1)"
        log "  Local:     http://localhost:$SERVE_PORT/"
        log "  Tailscale: http://${TS_HOSTNAME:-<ip>}:$SERVE_PORT/"
        if tailscale serve status 2>&1 | grep -q "HTTPS"; then
            log "  HTTPS:     https://${TS_HOSTNAME:-<hostname>}/"
        fi
        log "=========================================="
    else
        err "Verification failed (HTTP $HTTP_CODE)"
    fi
}

# ---- Stop ----
stop() {
    if [ -f "$SERVE_PID_FILE" ]; then
        PID=$(cat "$SERVE_PID_FILE")
        log "Stopping serve (PID $PID)..."
        kill "$PID" 2>/dev/null || true
        rm -f "$SERVE_PID_FILE"
    else
        warn "No PID file found"
    fi
}

# ---- Usage ----
usage() {
    cat <<EOF
Usage: ./deploy.sh [command]

Commands:
  build        Build Astro site
  serve        Start local HTTP server (npx serve)
  tailscale    Expose via Tailscale Serve (needs sudo)
  funnel       Expose publicly via Tailscale Funnel (needs sudo)
  verify       Verify deployment is working
  stop         Stop the local server
  all          Build + Serve + Verify

Examples:
  ./deploy.sh all                              # Build and serve locally
  ./deploy.sh all && sudo ./deploy.sh funnel   # Build + serve + public
EOF
}

# ---- Main ----
case "${1:-all}" in
    build)    build ;;
    serve)    serve ;;
    tailscale) tailscale_serve ;;
    funnel)   tailscale_funnel ;;
    verify)   verify ;;
    stop)     stop ;;
    all)
        build
        serve
        verify
        ;;
    *)
        usage
        exit 1
        ;;
esac
