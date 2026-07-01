#!/bin/bash

REGISTRY="registry.digitalocean.com/hcww-registry"
TAG="latest"
DOMAIN="games.cds-software.online"

while [ "$#" -gt 0 ]; do
    case "$1" in
        --registry) export REGISTRY="$2"; shift ;;
        --tag) export TAG="$2"; shift ;;
        --domain) export DOMAIN="$2"; shift ;;
        *)
            case "$1" in
                --*) ;;
                *)
                    if [ -z "$REG_SET" ]; then
                        export REGISTRY="$1"
                        REG_SET=true
                    elif [ -z "$TAG_SET" ]; then
                        export TAG="$1"
                        TAG_SET=true
                    elif [ -z "$DOMAIN_SET" ]; then
                        export DOMAIN="$1"
                        DOMAIN_SET=true
                    fi
                    ;;
            esac
            ;;
    esac
    shift
done

export REGISTRY
export TAG
export DOMAIN

echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo "Domain: $DOMAIN"

# Build the nodejs image
docker build . -f ./docker/Dockerfile -t "$REGISTRY/hcww-games:$TAG"

# Push the image to the registry
docker push "$REGISTRY/hcww-games:$TAG"

# Deploy to Docker Swarm
docker stack deploy -c ./games.yml hcww-games --prune --with-registry-auth -d --resolve-image always
