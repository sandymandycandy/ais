#!/bin/bash

# Fix all import statements from named to default imports

echo "Fixing import statements..."

# Fix Button imports
find src -type f -name "*.tsx" -exec sed -i "s/import { Button } from/import Button from/g" {} \;

# Fix Card imports
find src -type f -name "*.tsx" -exec sed -i "s/import { Card } from/import Card from/g" {} \;

# Fix Badge imports
find src -type f -name "*.tsx" -exec sed -i "s/import { Badge } from/import Badge from/g" {} \;

# Fix Input imports
find src -type f -name "*.tsx" -exec sed -i "s/import { Input } from/import Input from/g" {} \;

echo "Import fixes applied!"
