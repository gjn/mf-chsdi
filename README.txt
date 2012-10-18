After GIT clone
===============
Init the submodules:

git submodule init

Update the submodules:

git submodule update

Update the svn external repositories

sh hooks/svnrepos.sh

Installation
============

Install the buildout environment:

  python bootstrap.py --distribute --version 1.5.2  --distribute --download-base http://pypi.camptocamp.net/ --setup-source http://pypi.camptocamp.net/distribute_setup.py

Install the project:

  buildout/bin/buildout

If you have a custom buildout config file, you should instead run:

  buildout/bin/buildout -c buildout_myconfig.cfg

Now look at apache/README.txt and go configure your Apache virtual host.

Internationalization
====================

Getting Started
---------------

1) Uncomment the 'message_extractors' option in setup.py.

2) Extract all messages from the project:

  buildout/bin/python setup.py extract_messages

3) Initialize a catalog for every supported language, for example:

  buildout/bin/python setup.py init_catalog -l fr
  buildout/bin/python setup.py init_catalog -l en

4) Edit the .po files in geoadmin/i18n/*/LC_MESSAGES/geoadmin.po

5) Finally, compile the .po file to a .mo file:

  buildout/bin/python setup.py compile_catalog

Source: http://wiki.pylonshq.com/display/pylonsdocs/Internationalization+and+Localization

JavaScript translations
-----------------------

The JavaScript translated strings are stored in the BOD database. In order to produce the JavaScript files lang.js in the i18n directory, start this command:

   ./buildout/bin/buildout -c buildout_myconfig.cfg install jstranslate
