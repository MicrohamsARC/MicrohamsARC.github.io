#!/bin/bash
# Docker helper script for MicroHAMS development
# Usage: .docker/docker.sh [command]

set -e
cd "$(dirname "$0")/.."

COMPOSE="docker compose -f .docker/docker-compose.yml"

case "${1:-help}" in
  ci)
    # Run full CI pipeline
    $COMPOSE run --rm ci
    ;;
  unit)
    # Run unit tests only
    $COMPOSE run --rm unit
    ;;
  dev)
    # Start dev server (Ctrl+C to stop)
    $COMPOSE up dev
    ;;
  e2e)
    # Run E2E tests (starts dev server automatically)
    $COMPOSE up --abort-on-container-exit e2e
    ;;
  build)
    # Rebuild images (use after package.json changes)
    $COMPOSE build
    ;;
  clean)
    # Remove project containers and networks (keeps images for fast rebuilds)
    $COMPOSE down --remove-orphans
    echo "✓ Removed containers and networks"
    ;;
  purge)
    # Remove everything including images (full reset)
    $COMPOSE down --rmi all --volumes --remove-orphans
    echo "✓ Removed all containers, images, and volumes"
    ;;
  prune)
    # System-wide cleanup of unused Docker resources
    echo "This will remove all unused Docker resources system-wide."
    read -p "Continue? [y/N] " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      docker system prune -f
      echo "✓ Pruned unused resources"
    fi
    ;;
  status)
    # Show running containers and image sizes
    echo "=== Containers ==="
    $COMPOSE ps -a
    echo
    echo "=== Images ==="
    docker images | grep -E "^(docker-|REPOSITORY)" || echo "No project images"
    ;;
  *)
    echo "MicroHAMS Docker Helper"
    echo
    echo "Usage: .docker/docker.sh <command>"
    echo
    echo "Commands:"
    echo "  ci      Run full CI pipeline (lint, type-check, test, build)"
    echo "  unit    Run unit tests only"
    echo "  dev     Start development server on port 4321"
    echo "  e2e     Run Playwright E2E tests"
    echo "  build   Rebuild Docker images"
    echo
    echo "Cleanup:"
    echo "  clean   Remove containers/networks (keeps images)"
    echo "  purge   Remove everything (full reset)"
    echo "  prune   System-wide Docker cleanup (interactive)"
    echo "  status  Show containers and images"
    ;;
esac
