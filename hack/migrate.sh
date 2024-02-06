#! /bin/bash

# Initialize pg-roll
pgroll init

# Apply migrations
pgroll start sql/01_create_items_table.json --complete
