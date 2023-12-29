#!/usr/bin/env bash

if grep -q "31ngo.local" "/etc/hosts"; then
  echo "Host 31ngo.local found! Not modifying hosts."
else
  echo "Adding urls to hosts:"
  echo "127.0.0.1 31ngo.local" | sudo tee -a /etc/hosts
fi
