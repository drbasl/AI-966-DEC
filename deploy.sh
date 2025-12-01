#!/bin/bash

# ====================================
# Raqim AI 966 - Deployment Script
# ====================================

set -e  # Exit on error

echo "🚀 Raqim AI 966 - Deployment Script"
echo "===================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if .env exists
if [ ! -f .env ]; then
    log_warning ".env file not found!"
    log_info "Creating from .env.example..."
    cp .env.example .env
    log_warning "⚠️  Please edit .env file with your configuration before deploying!"
    exit 1
fi

# Menu
echo "Select deployment action:"
echo "1) 🏗️  Build & Start"
echo "2) 🔄 Restart"
echo "3) 🛑 Stop"
echo "4) 📊 View Logs"
echo "5) 🧹 Clean & Rebuild"
echo "6) 📈 Status"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        log_info "Building Docker images..."
        docker compose build

        log_info "Starting containers..."
        docker compose up -d

        log_success "Deployment complete!"
        log_info "Application running at: http://localhost"
        log_info "View logs: docker compose logs -f"
        ;;

    2)
        log_info "Restarting containers..."
        docker compose restart

        log_success "Containers restarted!"
        ;;

    3)
        log_info "Stopping containers..."
        docker compose down

        log_success "Containers stopped!"
        ;;

    4)
        log_info "Viewing logs (Ctrl+C to exit)..."
        docker compose logs -f
        ;;

    5)
        log_warning "This will remove all containers, images, and volumes!"
        read -p "Are you sure? (yes/no): " confirm

        if [ "$confirm" == "yes" ]; then
            log_info "Stopping containers..."
            docker compose down -v

            log_info "Pruning Docker system..."
            docker system prune -af

            log_info "Rebuilding..."
            docker compose build --no-cache

            log_info "Starting fresh containers..."
            docker compose up -d

            log_success "Clean rebuild complete!"
        else
            log_info "Operation cancelled."
        fi
        ;;

    6)
        log_info "Container Status:"
        docker compose ps

        echo ""
        log_info "Resource Usage:"
        docker stats --no-stream

        echo ""
        log_info "Disk Usage:"
        docker system df
        ;;

    *)
        log_error "Invalid choice!"
        exit 1
        ;;
esac

echo ""
log_success "Done! 🎉"
