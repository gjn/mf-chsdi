# workaround to a buildout bug
from pkg_resources import working_set
working_set.entries=[]; map(working_set.add_entry,sys.path)

import sys

from jstools import jst

jst.DocParser.from_fn(sys.argv[1]).run()
