try:
    from setuptools import setup, find_packages
except ImportError:
    from ez_setup import use_setuptools
    use_setuptools()
    from setuptools import setup, find_packages

setup(
    name = 'chsdi',
    version = '0.1',
    description = '',
    author = '',
    author_email = '',
    url = '',
    install_requires = [
        "mapfish", "httplib2",
        "psycopg2",
        "PyYAML",
        "lxml<=2.2.8",
        "Babel<=0.9.99"
    ],
    #setup_requires=["PasteScript>=1.6.3"],
    packages = find_packages(exclude=['ez_setup']),
    include_package_data = True,
    test_suite = 'nose.collector',
    package_data = {'chsdi': ['i18n/*/LC_MESSAGES/*.mo']},
    message_extractors={'chsdi': [
           ('**.py', 'python', None),
           ('templates/**.mako', 'mako', {'input_encoding': 'utf-8'}),
           ('public/**', 'ignore', None)]},
    zip_safe = False,
    #paster_plugins=['MapFish', 'PasteScript', 'Pylons', 'chsdi'],
    entry_points = """
    [paste.app_factory]
    main = chsdi.config.middleware:make_app

    [paste.app_install]
    main = pylons.util:PylonsInstaller
    """,
)
