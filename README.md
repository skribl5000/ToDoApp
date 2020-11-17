<p>
Проект представляет собой простейшее приложение для ведения задач.<br/>
Основная страница разработана на html - index.html<br/>
Стили представлены в виде двух css файлов - reset.css & style.css<br/>
Логика работы FrontEnd описана на javascript - в файле script.js
Логика работы BackEnd описана на python с применением библиотеки Flask - service.py <br/>
Данные хранятся в локальном файле tasks.json в формате json.
</p>

Для корректной работы необходимо выполнить след шаги:
<ol>
<li>Установить <a href="https://www.python.org/downloads/release/python-386/">python версии 3.5+</a></li>
<li>Установить библиотеки python:
<ul>
<li>flask</li>
<li>flask_cors</li>
</ul>
<code> pip install -r requirements.txt 
</code>
</li>
<li>Запустить сервис на питоне любым способом. Несколько из них <a href="https://mkdev.me/posts/kak-zapustit-skript-na-python">тут</a>. </li>
<li>Открыть <a href="http://localhost:5000/">приложение</a> для ведения задач (http://localhost:5000/)</li>
</ol>