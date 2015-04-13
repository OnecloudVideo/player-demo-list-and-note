基本说明
===================
>本例子展示如何将亦云视频嵌入到你的网页当中，并且利用亦云平台提供的 Flash Player 的 JS
API 对视频进行控制，例如播放、暂停、seek、获取片长、获取当前播放时间等。

使用说明
-------------
>1.Demo 中的视频存放在亦云视频（http://video.pispower.com），
如果你需要更换演示视频，请
将你的视频上传到亦云视频，成功转码之后将flash代码拷贝到playlistnote.html页面。（具体方法请
参考playlistnote.html页面的注释）

>2.将demo放于一个静态服务器，启动静态服务器。(注：必须，否则你的视频可能无法正常播放）

>3.用浏览器访问demo应用页面:playlistnote.html，如果你的服务器地址是 
http://www.abc.com，
请输入 
http://www.abc.com/playlistnote.html

功能说明
-------------
>1.视频播放列表

>点击任何一个视频，播放器播放该视频，该视频播放次数增加。

>2.课堂笔记

>在记录课堂笔记时，获取当前视频播放时间，保存课堂笔记后，可以对课堂笔记进行删除，
也可以根据记录课堂笔记的时间播放视频。

数据存储、操作
-------------
>
在本示例中，视频播放次数、课堂笔记均存储在页面中，你应该需要将这部分的内容持久化到你的数据
库，你可以通过Ajax来提交相关的数据。

文件组织结构
-------------
```
player-demo-list-and-note
	|
	|--images
	|	|
	|	|--css--default.css		        示例页面的默认样式 
	|	|
	|	|--*.png/*.jpg			        示例页面所需图标
	|
	|--js
	|	|
	|	|--jquery-1.11.2.min.js			jquery
	|	|
	|	|--play-list-note.js			实现示例页面展示效果的js
	|
	|--playlistnote.html				示例页面
```
	

