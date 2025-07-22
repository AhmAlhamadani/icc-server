# To start postgres service
pg_ctl -D /usr/local/var/postgres start

# To access database
psql -U ahmed -d icc_database

# To run server
npm run dev