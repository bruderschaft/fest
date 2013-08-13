# Fest [![Build Status](https://travis-ci.org/eprev/fest.png?branch=0.7)](https://travis-ci.org/eprev/fest)

## Основы

Fest — это javascript шаблонизатор, являющийся модулем node js. Для установки требуется node.js версии  не ниже 0.8

### Установка

```
$ npm install fest
```

## Основы использования

Для запуска примеров нужно создать шаблон и запустить его с помощью метода **render()**. Сделать это можно несколькими способами:

###1. Запустить из терминала скрипт 
(fest установлен в домашнюю директорию, проект находится в директории **~/myproject**):

~/myproject/example.xml:

```xml
<?xml version="1.0"?> 
<fest:template xmlns:fest="http://fest.mail.ru" context_name="json"> 
 <fest:set name="line"> 
     Hello,<fest:space/><fest:value>params.username</fest:value> 
 </fest:set> 
 <fest:get name="line">{username: "John"}</fest:get> 
 </fest:template>
```
 
```bash
 ~$ fest/bin/fest-render myproject/basic.xml
```
такая команда выведет «Hello, John».	

###2. Воспользоваться API:
Используем тот же шаблон, лежащий, по прежнему, в **~/myproject/example.xml**. Создадим в папке проекта файл **compile.js** и вставим в него такой код:

```xml
var fest = require('fest'); 
//подключили модуль fest
console.log(fest.render('basic.xml'));
//[выведем в STDOUT] результат работы скомпилированного шаблона
```

И запустим его:

```bash
~/myproject$ node compile.js
```

Эта команда также выведет «Hello, John».	

Ознакомиться с подробным описанием команд компиляции, рендеринга и сборки проекта можно здесь, API [здесь](#api).

##Шаблоны
Шаблон содержит переменные, которые будут заменены значениями при обработке шаблона, и управляющие конструкции, которые управляют логикой шаблона. В fest шаблон объявляется с помощью парного тега ```<fest:template></fest:template>```. Все примеры далее содержат только значащую часть кода. Чтобы запустить пример, надо «обернуть» его в тег fest:template и добавить перед этим ```<?xml version="1.0"?>``` 

###fest:get, fest:set
Объявление и получение переменных шаблона:

```xml
<fest:set name="username">John</fest:set>
<!-- объявили переменную с именем username -->
<fest:get name="username"/>
<!-- получили значение переменной username -->
```

Скомпилированный шаблон выведет «John».<br/>
Когда fest встречает в шаблоне **fest:set** (объявление переменной шаблона), то он «запоминает» ее. Встречая **fest:get**, шаблонизатор подставляет вместо него значение, объявленное в **fest:set** с таким же атрибутом name. <br/>
При получении значения переменной в нее можно передать параметр:

```xml
<fest:set name="greeting">
	Hello,<fest:space/><fest:value>params.username</fest:value>
</fest:set>
<fest:get name="greeting">{username: "John"}</fest:get>
```

Скомпилированный шаблон выведет «Hello, John». 

**fest:space** отвечает за вставку пробела. В объявлении переменной обращение к параметрам происходит с помощью объекта params. Чтобы вывести значение любого выражения, используйте fest:value. 

###fest:param, fest:params
Кроме простых параметров можно передавать куски xml-кода с помощью **fest:param** :

```xml
<fest:set name="page">
	<fest:value output="text">params.header</fest:value>
	<h2>Content</h2>
</fest:set>
<fest:get name="page">
	<fest:param name="header">
            <h1>
                Header!!!
            </h1>
        </fest:param>
</fest:get>
```

Если в **fest:get** есть **fest:param**, то передать параметры просто в скобках не получится. Надо «обернуть» их в **fest:params**. 

**Тег fest:params должен стоять первым вложенным тегом в fest:get**

```xml
<fest:set name="profile">
	<fest:value output="text">params.greeting</fest:value>,
		<fest:value output="text">params.name</fest:value><fest:space/>
		<fest:value output="text">params.surname</fest:value>,
		<fest:value output="text">params.adress</fest:value>,
		<fest:value output="text">params.age</fest:value>
	</fest:set>
	<fest:get name="profile">
		<fest:params>
		{
	        	name: "Ostap",
	        	surname: "Bender",
	        	age: "113",
	        	adress: "Odessa, Ukraine"	    
		}
		</fest:params>
		<fest:param name="greeting">
		<h1>
			Hello!
		</h1>
 	        </fest:param>
	</fest:get>
```

Чтобы передать параметры во время рендеринга, используется контекст JSON. Рассмотрим вызов метода **render()**.

template.xml:

```xml
<fest:value>json.greeting</fest:value>
<fest:value>json.name</fest:value>
```

```javascript
render('template.xml', { 'greeting': 'hey, ', 'name': 'dude' })
```

Скомпилированный шаблон выведет «hey, dude». Теперь усложним шаблон:

```xml
<fest:set name="index">
	<title><fest:value output="text">params.Name </fest:value></title>
	<h1><fest:value output="text">params.title </fest:value><fest:space/></h1>
	<big><fest:value output="text">params.greet</fest:value></big>
	<p><fest:value output="text">params.topic</fest:value></p>
	<fest:value output="text">params.footer</fest:value>
</fest:set>
<fest:set name="greeting">
	Hi,<fest:space/><fest:value>params.username</fest:value>
</fest:set>
<fest:get name="index">
	<fest:params>
	{
		Name: json.title,
		topic: "lorem ipsum",
		title: "Fest start page",
	}
	</fest:params>
	<fest:param name="footer">
		about
	</fest:param>
	<fest:param name="greet">
		<h1>
			<fest:get name="greeting">{username: "David"}</fest:get>
		</h1>
	</fest:param>
</fest:get>
```

Вместо такого написания можно использовать более короткое объявление параметров. Параметры из **fest:params** переносятся в атрибут params **fest:get** :

```xml
<fest:set name="index">
	<title><fest:value output="text">params.name </fest:value></title>
	<h1><fest:value output="text">params.title </fest:value><fest:space/></h1>
	<big><fest:value output="text">params.greet</fest:value></big>
	<p><fest:value output="text">params.topic</fest:value></p>
	<fest:value output="text">params.footer</fest:value>
</fest:set>
<fest:set name="greeting">
	Hi,<fest:space/><fest:value>params.username</fest:value>
</fest:set>
<fest:get name="index" params="name: json.title, topic: 'lorem ipsum', title: 'Fest start page'">
	<fest:param name="footer">
		about
	</fest:param>
	<fest:param name="greet">
		<h1>
	        	<fest:get name="greeting">{username: "David"}</fest:get>
		</h1>
	</fest:param>
</fest:get>
```

##Управляющие конструкции

###fest:each
Цикл по всем элементам массива. Например, вывод всех элементов **obj**:

```xml
<fest:script>var obj = {"foo": "bar"}</fest:script>
<fest:each iterate="obj" index="i">
	<fest:value>i</fest:value>=<fest:value>obj[i]</fest:value>
</fest:each>
```

Скомпилированный шаблон выведет «foo=bar».

Обращение к итерируемому элементу:

```xml
<fest:each iterate="obj" index="i" value="v">
	<fest:value>i</fest:value>=<fest:value>v</fest:value>
</fest:each>
```

###fest:for
Цикл, аналогичный **fest:each** с возможностью обхода диапазона элементов массива. Шаблон

```xml
<fest:script>json.items = ['a', 'b', 'c','d','e']</fest:script>
<fest:for from="1" to="3" index="i">
  <fest:value>i</fest:value>
</fest:for>
```

Выведет «bcd»

###fest:if
Условный оператор. Выводит блок шаблона, если выражение в атрибуте test истинно.

```xml
<fest:if test="true">
  true
</fest:if>
```

Аналогично можно использовать атрибут **test** в теге **fest:set**:

```xml
<fest:set name="name" test="false">should not be set</fest:set>
```

Кроме условного оператора в fest есть оператор ветвления [**fest:choose**](#festchoose)

###fest:include
Вставка содержимого другого шаблона с заданным контекстом. В атрибуте context указывается контекст, src — путь до вставляемого шаблона.

```xml
<fest:script>json.list = ['a', 'b', 'c'];</fest:script>
<fest:include context="json.list" src="./include_foreach.xml"/>
```

##Комментарии
Чтобы закомментировать строку в шаблоне используйте оператор **fest:comment**. Шаблон:

```xml
<fest:comment>comment</fest:comment>
```

Выведет:

```xml
<!--comment-->
```

Для вывода неформатированного текста используйте **fest:text**. Шаблон:

```xml
<fest:text value="a"/>
<fest:space/>
<fest:text value="\"/>
```
Выведет «a \\ »

##Работа с HTML и JS

###fest:doctype
Объявление doctype страницы

```xml
<fest:doctype>html</fest:doctype>
```

###fest:cdata
Для вывод блоков CDATA используйте **fest:cdata**. Шаблон:

```xml
<script>
	<fest:cdata>
		<![CDATA[alert ("2" < 3);]]>
	</fest:cdata>
</script>
```

Выведет:

```xml
<script><![CDATA[alert ("2" < 3);]]></script>
```

###fest:value
Выводит значение выражения. <br/>
Есть 4 режима: html (по умолчанию), текст, js, json. <br/>
HTML:

```xml
<fest:value>json.value</fest:value>
```

Выведет:

```
lt;script/&gt;
```

По умолчанию **fest:value** экранирует спецсимволы &,<,>,". Если надо отключить экранирование, используется атрибут **output**:
**output="text"** — ничего не экранирует:

```xml
<fest:value output="text"><![CDATA["<script/>"]]></fest:value>
```

Вернет:

```
<script/>
```

**output="js"** — экранирует спецсимволы javascript:

```xml
<fest:value output="js"><![CDATA["<script/>"]]></fest:value>
```

Выведет:

```
\\u003Cscript\\/\\u003E
```

**output="json"** - экранирует < и > и помещает всё выражение в кавычки:

```xml
<fest:value output="json"><![CDATA["<script/>"]]></fest:value>
```

Выведет:

```
"\\u003C\/script\\u003E"
```

###fest:var
Устанавливает js-переменную, название переменной задается в атрибуте name:

```xml
<fest:var name="question">Ultimate Question of Life, The Universe, and 	Everything</fest:var>
<fest:value>question</fest:value>
```

Выведет:

```
Ultimate Question of Life, The Universe, and Everything
```

Если нужно объявить js-переменную со значением, зависящим от другой переменной, используйте атрибут select:

```xml
<fest:var name="answer" select="question.length - 13" />
<fest:value>answer</fest:value>
```

Объявлена переменная **answer**, равная **question.length -13**. Значит **fest:value** выведет **(55-13)**:

```
42
```

###fest:script
Выполняет js-код. Для выполнения кода из отдельного файла нужно указать путь к файлу в атрибуте **src**:

```xml
<fest:script>
	<![CDATA[
	json.script = 2 < 3;
	]]>
</fest:script>
"<fest:value>json.script</fest:value>"

<fest:script src="script.js"/>
"<fest:value>include_script</fest:value>"
```

script.js:
```javascript
var include_script = true + '!';
```

Выведет:

```
"true""true!"
```

###fest:attributes, fest:attribute
Добавляет атрибуты к родительскому тегу. Все **fest:attribute** должны быть внутри блока **fest:attributes**, который должен быть первым внутри тега.<br/>
Шаблон:

```xml
<a>
  <fest:attributes>
    <fest:attribute name="href">json.href</fest:attribute>
  </fest:attributes>
  Some link
</a>
```

Выведет:

```xml
<a href="http://mail.ru">Some link</a>
```

Тоже самое можно сделать с помощью сокращенной записи:

```xml
<a href="{json.href}">Some link</a>
```


##Остальное

###fest:choose
Оператор ветвления.  Если ни один **fest:when** не будет выполнен, выполнится **fest:otherwise**.

```xml
<fest:choose>
  <fest:when test="1">
    <fest:text>one</fest:text>
  </fest:when>

  <fest:when test="2">
    <fest:text>two</fest:text>
  </fest:when>

  <fest:otherwise>
    <fest:text>More than 2</fest:text>
  </fest:otherwise>
</fest:choose>
```

###fest:element
Выводит тег с переменным именем. В атрибуте **select** указывается имя переменной

```xml
<fest:script>
    var variable = 'table';
</fest:script>
<fest:element select="variable">
    fest code
</fest:element>
<fest:element select="variable2">
    fest code
</fest:element>
```

Выведет:

```xml
<table>fest code</table><div>fest code</div>
```

###fest:insert
Вставка файла напрямую в шаблон. С помощью **fest:insert** можно вставить файл со стилями css или с javascript кодом. 

```xml
<style type="text/css">
  <fest:insert src="style.css"/>
<style>
<script type="text/javascript">
	<fest:insert src="script.js"/>
</script>
```

##Сборка проекта с помощью fest
Сборка проекта происходит с помощью трех методов.<br/>

**compile** преобразует xml-шаблон (компилирует) в запускаемый js-скрипт,<br/>
**render** компилирует шаблон и запускает созданный скрипт,<br/>
**build** собирает проект (компилирует все шаблоны в указанной директории).<br/>
В этом разделе описаны команды терминала. API [дальше](#api).<br/>

###compile()
Компилирует шаблон (преобразует xml в javascript), не подставляет значения переменных шаблона. Использование: 

```bash
~/fest/bin/fest-compile [--out=...] [--wrapper=...] [--translate=...] template.xml
```
Где:

**--out** — путь до файла для сохранения результата; для вывода в STDOUT --out=- по умолчанию STDOUT<br/> 
**--wrapper** — type of postcompile wrappers, fest|loader|source|variable (default is fest) <br/>
**--translate** — путь к PO файлу для перевода <br/>
**template.xml** — путь к шаблону в формате .xml <br/>
а так же:<br/>
**--version** — установленная версия fest<br/>
**--help** — вызов справки по методу<br/>

###render()
Компилирует шаблон, подставляет значения переменных шаблона, контекст json и запускает скомпилированный шаблон. Использование:

```bash
~/fest/bin/fest-render [--json=...] [--out=...] filename.xml
```
Где:<br/>
**--json** — путь до json-файла<br/>
**--out** — путь до файла для сохранения результата; для вывода в STDOUT --out=- по умолчанию STDOUT <br/>
а так же:<br/>
**--version** — установленная версия fest<br/>
**--help** — вызов справки по методу<br/>

###build()
Компилирует шаблоны в указанной директории. Использование:

```bash
fest-build --dir=... [--out=...] [--wrapper=...] [--exclude=...] 
```

Где:<br/>
**--dir** — директория с шаблонами<br/>
**--wrapper** — type of postcompile wrappers, fest|loader|source|variable (default is fest) <br/>
**--exclude** — регулярное выражение, показывающее, какие файлы не надо 	компилировать (можно использовать для исключения шаблонов, проверяющих вывод ошибок)<br/>
**--out** — путь до директории для сохранения скомпилированных шаблонов; по умолчанию --out=--dir<br/>
**--po**        output PO file <br/>
**--translate** input PO file <br/>
 а так же:<br/>
**--version** — установленная версия fest<br/>
**--help** — вызов справки по методу<br/>

##API
Для использования API fest-a, не забудьте подключить модуль:

```javascript
var fest = require('fest');
```

###compile()
Компилирует шаблон (преобразует xml в javascript), подставляет значения переменных шаблона. Пример использования:

```javascript
var data = {name: 'Jack "The Ripper"'},
    template = './templates/basic.xml';
fest.compile(template, {beautify: false});
```

Параметр  **beautify** отвечает за расстановку переносов и знаков табуляции в скомпилированном шаблоне 

###render()
Компилирует шаблон, подставляет контекст json и запускает скомпилированный шаблон.

```javascript
fest.render(template, data, {beautify: false}));
```

```javascript
var fest = require('fest');

var data = {name: 'Jack "The Ripper"'},
    template = './templates/basic.xml';

console.log(fest.render(template, data, {beautify: false}));
```

## Интернационализация

### fest:plural
По умолчанию доступна поддержка плюрализации для русского и английского языка. В параметрах `fest.compile` можно передать любую другую функцию плюрализации.

```xml
<fest:plural select="json.n">один рубль|%s рубля|%s рублей</fest:plural>
```
Или англоязычный вариант:

```xml
<fest:plural select="json.n">one ruble|%s rubles</fest:plural>
```

Чтобы вывести символ “%” внутри тега `fest:plural` используйте “%%”:

```xml
<fest:plural select="json.n">…1%%…|…%s%%…|…%s%%…</fest:plural>
```

### fest:message и fest:msg

Позволяет указать границы фразы для перевода и контекст для снятия многозначности. Например,

```xml
<fest:message context="растение">Лук</fest:message>
<fest:message context="оружие">Лук</fest:message>
```

Для каждого `fest:message`, `fest:msg`, обычного текста, заключенного между XML тегами (опция `auto_message`), или текстового значения некоторых атрибутов компилятор вызывает функцию `events.message` (если такая была указана в параметрах). Данный механизм используется в `fest-build` утилите для построения оригинального PO-файла.

Пример вызова `fest-build` для создания PO-файла:

```
$ fest-build --dir=fest --po=ru_RU.po --compile.auto_message=true
```

Пример компиляции локализованных шаблонов:

```
$ fest-build --dir=fest --translate=en_US.po
```

Пример компиляции одного шаблона:

```
$ fest-compile path/to/template.xml
$ fest-compile --out=path/to/compiled.js path/to/template.xml
$ fest-compile --out=path/to/compiled.js --translate=path/to/en_US.po path/to/template.xml
```

## Contribution

Необходимо установить [Grunt](http://gruntjs.com):

```
$ git clone git@github.com:mailru/fest.git
$ cd fest
$ sudo npm install -g grunt-cli
$ npm install
$ grunt
```

Grunt используется для валидации JS (тестов) и запуска тестов. Перед отправкой пулл-риквеста убедись, что успешно выполнены `git rebase master` и `grunt`.

Если необходимо пересобрать шаблоны spec/expected, то выполните:

```
$ ./bin/fest-build --dir=spec/templates --exclude=*error* --compile.beautify=true --out=spec/expected/initial
$ ./bin/fest-build --dir=spec/templates --exclude=*error* --compile.beautify=true --out=spec/expected/translated --translate=spec/templates/en_US.po
```

