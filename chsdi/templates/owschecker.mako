<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
        "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <title>OWS Checker</title>
    <script type="text/javascript">

    </script>
    <style type="text/css">
        td {
            border-bottom: 1px solid #000000;
            vertical-align: top;
            padding: 15px;
        }
        .hint {
            color: #6E6E6E;
            font-size: 9pt;
            font-style: italic;
        }
        th {
            text-align: left;
            padding: 15px 0;
            border-bottom: 1px solid #000000;
        }
        form {
            margin-bottom: 20px;
            border: 3px solid black;
            padding: 15px;
        }
        td ul {
            margin: 0;
        }
    </style>
</head>
<body>
    <h2>OWS Checker</h2>
    <div id="form">
        <form action="#" method="get" name="form_checker" id="form_checker">
            <table>
                <tr>
                    <td>
                        <label for="base_url">Service URL:</label>
                    </td>
                    <td>
                        <input type="text" title="base_url" id="base_url" name="base_url" value="${base_url}"><br />
                        <p class="hint">Hint: Don't use tailing "?" here, just put the base URL i.e.: http://lidarserver.com/sandiego</p>

                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="service">Service Type:</label>
                    </td>
                    <td>
                        <select name="service" id="service">
                            <option
                                % if service=="WMS":
                                    selected="selected"
                                % endif
                                    title="WMS" value="WMS">WMS</option>
                            <option
                                % if service=="WFS":
                                    selected="selected"
                                % endif
                                    title="WFS" value="WFS">WFS</option>
                            <option
                                % if service=="WCS":
                                    selected="selected"
                                % endif
                                    title="WCS" value="WCS">WCS</option>
                            <option
                                % if service=="CSW":
                                    selected="selected"
                                % endif
                                    title="CSW" value="CSW">CSW</option>
                            <option
                                % if service=="WMTS":
                                    selected="selected"
                                % endif
                                    title="WMTS" value="WMTS">WMTS</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="ssurl">Server Settings URL:</label>
                    </td>
                    <td>
                        <input type="text" title="ssurl" name="ssurl" id="ssurl" value="${ssurl}">
                    </td>
                </tr>
                <tr>
                    <td>
                        <label for="restful">Service Restful-Only?:</label>
                    </td>
                    <td>
                        <input type="checkbox" title="restful" id="restful" name="restful" value="restful"
                            % if restful:
                                checked="checked"
                            % endif
                            >
                        <p class="hint">Hint: Only for WMTS</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td><input type="submit" title="Start" value="Start"></td>
                </tr>
            </table>
        </form>
    </div>
    <div id="results">
        % if results_dict:
            <table>
                <tr>
                    <th colspan="2">Checker Status</th>
                </tr>
            % for nr, results in results_dict.items():
                % if nr == 0:
                    <tr>
                        <td>${results['name']}</td>
                        <td style="background-color: ${results['status']};">
                            <ul>
                                % for item in results['msg']:
                                    <li>${item}</li>
                                % endfor
                            </ul>
                        </td>
                    </tr>
                <tr>
                    <th>Richtlinie</th>
                    <th>Ausgabe</th>
                </tr>
                % else:
                    % for riliid, riliresults in results['rili'].items():
                        <tr>
                            <td>
                                % if riliid < 10:
                                    ${results['name']}-0${riliid}
                                % else:
                                    ${results['name']}-${riliid}
                                % endif
                            </td>
                            <td style="background-color: ${riliresults['status']};">
                                <ul>
                                    % if len(riliresults['msg']):
                                        <li>${riliresults['msg'][0]}</li>
                                    % endif
                                    <!--
                                    % for item in riliresults['msg']:
                                        <li>${item}</li>
                                    % endfor
                                    -->
                                </ul>
                            </td>
                        </tr>
                    % endfor
                % endif
            % endfor
            </table>
        % endif
    </div>
</body>
</html>