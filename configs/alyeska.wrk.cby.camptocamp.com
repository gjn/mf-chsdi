# To tunnel PostgreSQL connections to the dev machine into SSH:
#
# $ ssh -N -L 3333:localhost:5432 mf0t.bgdi.admin.ch
#
# Now
#
# $ psql -h localhost -p 3333 -U www-data -d bod
#
# should work

export HOST="http://alyeska.wrk.cby.camptocamp.com:5000"
export API_VERSION=""
export DB_HOST="localhost"
export DB_PORT="3333"
