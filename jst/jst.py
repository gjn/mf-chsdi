import sys

from jstools import jst

jst.DocParser.from_fn(sys.argv[1]).run()
