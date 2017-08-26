import flask
import json
import datetime
import logging
from logging.handlers import RotatingFileHandler
import src.Database
app = flask.Flask(__name__)
db = src.Database.DatabaseAccesser('./src/db/')

app.logger.setLevel(logging.DEBUG)
debug_file_handler = RotatingFileHandler('app.log', maxBytes=100000, backupCount=10)
app.logger.addHandler(debug_file_handler)

@app.route('/')
def index():
    icons_html = ''
    for data in db.Loads():
        icons_html += data.GetImgString()
    return flask.render_template('index.html', icons=flask.Markup(icons_html))

@app.route('/AppendUrl', methods=['POST'])
def post_append_url():
    app.logger.debug('-------------------------------- post_append_url()')
    return_data = {}
    exception = ''
    message = ''
    url = flask.request.json['Url']
    app.logger.debug('引数: {0}'.format(url))
    try:
        data = db.InsertGet(url)
        if None is not data:
            return_data.update({data.Classname: {'href': data.Url, 'title': data.Title, 'src': data.DataUri}})
        else:
            message += '既存 ' + url + '\n'
    except Exception as e:
        exception += "{0:%Y-%m-%d %H:%M:%S}".format(datetime.datetime.now()) + " 失敗 " + line + str(e.args) +'\n'
    if 0 < len(message.strip()): return_data.update({'message': message})
    if 0 < len(exception.strip()): return_data.update({'exception': exception})
    app.logger.debug(json.dumps(return_data))
    return flask.jsonify(ResultSet=json.dumps(return_data))

@app.route('/AppendUrls', methods=['POST'])
def post_append_urls():
    app.logger.debug('-------------------------------- post_appends_url()')
    urls = flask.request.json['Urls']
    result = ''
    html = ''
    css = {}
    exception = ''
    message = ''
    return_data = {}
    for line in urls.split('\n'):
        app.logger.debug('debug message: {0}'.format(line))
        if 0 == len(line.strip()):
            continue;
        try:
            app.logger.debug('-------------------------------- InsertGet前')
            data = db.InsertGet(line)
            app.logger.debug('-------------------------------- InsertGet後:{0}'.format(data))
            if None is not data:
                return_data.update({data.Classname: {'href': data.Url, 'title': data.Title, 'src': data.DataUri}})
            else:
                message += '既存 ' + line + '\n'
                pass
        except Exception as e:
            exception += "{0:%Y-%m-%d %H:%M:%S}".format(datetime.datetime.now()) + " 失敗 " + line + str(e.args) +'\n'
    if 0 < len(message.strip()):
        return_data.update({'message': message})
    if 0 < len(exception.strip()):
        return_data.update({'exception': exception})
    return flask.jsonify(ResultSet=json.dumps(return_data))

if __name__ == '__main__':  
    app.run() # localhost:5000
#    app.run(host="127.0.0.1", port=8080)

