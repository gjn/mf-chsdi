# How to tunnel postgresql connections into ssh, with a hop
# on a machine that has the vpn to chtopo open:
# 
# on the gateway machine (e.g. grange.wrk.lsn):
# $ ssh -N -L 3333:localhost:5432 bgdimf01t.lt.admin.ch
#
# on the local machine:
# $ ssh -N -L 3333:localhost:3333 grange.wrk.lsn.camptocamp.com
#
# now
# $ psql -h localhost -p 3333 -U www-data -d bod
# should work

export HOST="http://alyeska.wrk.cby.camptocamp.com:5000"
export API_VERSION=""
export DB_HOST="localhost"
export DB_PORT="3333"
