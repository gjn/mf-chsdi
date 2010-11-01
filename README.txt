Installation
============

Install the buildout environment:

  python bootstrap.py --distribute --version 1.5.2

Install the project:

  buildout/bin/buildout

If you have a custom buildout config file, you should instead run:

  buildout/bin/buildout -c buildout_myconfig.cfg

Now look at apache/README.txt and go configure your Apache virtual host.
