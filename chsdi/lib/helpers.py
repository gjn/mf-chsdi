"""Helper functions

Consists of functions to typically be used within templates, but also
available to Controllers. This module is available to templates as 'h'.
"""

def hilight(string, search, prefix="<span class='match'>", postfix="</span>"):
    if string is not None and search != '':
        start = string.lower().find(search.lower())
        while start > -1:
            stop = start + len(search.lower())
            string = string[:start] + prefix + string[start:stop] + postfix + string[stop:]
            next = len(string[:start] + prefix + string[start:stop] + postfix)
            start = string.lower().find(search.lower(), next)
    return string
