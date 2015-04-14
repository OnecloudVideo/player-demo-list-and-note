$(function() {

	// ----------------------- 数据操作，应该将这部分信息持久化到你的数据库中。

	// 播放次数存储于此，对播放次数的初始化、更新操作
	var frequencydb = {
		_data : [],
		init : function(videoId) {
			if (!this._data[videoId]) {
				this._data[videoId] = 0;
			}
			return this._data[videoId];
		},
		update : function(videoId) {
			this._data[videoId] += 1;
			return this._data[videoId];
		}
	};

	// 课堂笔记存储于此，对课堂笔记的增加、删除、查询操作
	var notedb = {
		_id : 0,
		_data : [],
		add : function(videoId, note, time) {
			var id = this._id++;
			if (!this._data[videoId]) {
				this._data[videoId] = [];
			}
			this._data[videoId][id] = {
				text : note,
				time : time
			};
			return id;
		},
		remove : function(videoId, noteId) {
			delete this._data[videoId][noteId];
		},
		list : function(videoId) {
			if (this._data[videoId]) {
				return this._data[videoId];
			} else {
				return [];
			}
		}
	};

	// -------------------------- 页面显示操作

	// 初始化播放次数
	$(".playlist_info").each(function() {
		var count = $(this).find("span");
		var videoId = $(this).find("dt").attr("videoId");
		var freq = frequencydb.init(videoId);
		count.text(freq);
	});

	// 在播放列表中点击所要播放的视频
	$(".video_small,.overflow_box").click(function() {

		// 隐藏正在播放的视频
		var currentVideoId = getCurrentVideoId();
		$("#" + currentVideoId).hide();
		$("dt[videoId=" + currentVideoId + "]").removeClass("now");

		// 显示当前播放的视频
		var videoId = $(this).attr("videoId");
		$("#" + videoId).show();
		$("dt[videoId=" + videoId + "]").addClass("now");

		// 记录当前播放视频的id
		$("#currentVideo").val(videoId);

		// 更新播放次数并显示播放次数
		var freq = frequencydb.update(videoId);
		$(this).parent().parent().find("span").text(freq);

		// 播放视频
		var playerId = $("#" + videoId).attr("playerId");
		var player = document.getElementById(playerId);
		play(player, 0);
	});

	// 调整播放器的宽度、高度，按照指定时间播放视频
	function play(player, seekTo) {
		var intervalId = setInterval(function() {
			try {
				player.width = "880px";
				player.height = "525px";

				player.seek(seekTo);
				player.play2();
				clearInterval(intervalId);
			} catch (e) {

			}
		}, 100);
	}
	
	// 切换到播放列表
	$("#playListTab").click(function() {

		// 显示播放列表
		$("#playList").show();

		// 隐藏课堂笔记
		$("#noteList").hide();

		// tab 高亮控制
		$("#playListTab").parent().addClass("now");
		$("#noteListTab").parent().removeClass("now");
	});

	// 切换到课堂笔记
	$("#noteListTab").click(function() {
		// 隐藏播放列表
		$("#playList").hide();

		// 初始化笔记部分内容
		$("#noteSet").empty();
		$("#noteInput").val("");
		$("#noteTime").hide();
		$("#noteList").show();

		// tab 高亮控制
		$("#noteListTab").parent().addClass("now");
		$("#playListTab").parent().removeClass("now");

		// 加载课堂笔记并写入页面
		var currentVideoId = getCurrentVideoId();
		var notes = notedb.list(currentVideoId);
		for ( var noteId in notes) {
			var text = notes[noteId].text;
			var time = notes[noteId].time;
			writeNoteToHtml(currentVideoId, text, time, noteId);
		}
	});

	// 记录课堂笔记时光标获得焦点事件
	$("#noteInput").focus(function() {
		var text = $("#noteInput").val();
		if (text.length == 0) {
			var currentPlayer = getCurrentPlayer();
			var time = currentPlayer.getCurrentTime();
			var inputTime = convertTimeToString(time);
			$("#noteTime").show().html(inputTime);
		}
	});

	// 记录课堂笔记时光标失去焦点事件
	$("#noteInput").blur(function() {
		var text = $("#noteInput").val();
		if (text.length == 0) {
			$("#noteTime").hide();
		}
	});

	// 提交笔记按钮的事件
	$("#submitNoteBtn").click(function() {

		// 验证笔记的长度
		var noteInput = $("#noteInput");
		var text = noteInput.val();
		if (text.length == 0) {
			alert("课堂笔记不能为空。");
			return;
		}

		// 持久化
		var videoId = getCurrentVideoId();
		var noteTime = $("#noteTime");
		var time = noteTime.html();
		var nodeId = notedb.add(videoId, text, time);

		// 将课堂笔记写入页面
		writeNoteToHtml(videoId, text, time, nodeId);

		// 重置输入部分信息
		noteInput.val("");
		noteTime.hide();
	});

	// 将记录的课堂笔记信息写入页面
	function writeNoteToHtml(videoId, text, time, nodeId) {
		var noteContainer = $("<div></div>").attr("id", "note_" + nodeId).attr(
				"videoId", videoId).addClass("ma10");

		// 课堂笔记之间的分隔线
		var line = $("<p></p>").addClass("play_line");
		line.appendTo(noteContainer);

		// 课堂笔记记录时间，并为笔记时间添加点击事件
		var playTime = $("<p></p>");
		var playTimeA = $("<a></a>").attr("href", "javascript:;").addClass(
				"i_play").html(time).click(function() {
			var videoId = $(this).parent().parent().attr("videoId");

			// 根据课堂笔记记录时间播放视频
			var noteTime = $(this).html();
			var seekTo = convertStringToTime(time);
			var currentPlayer = getCurrentPlayer();
			play(currentPlayer, seekTo);
		});
		playTimeA.appendTo(playTime);
		playTime.appendTo(noteContainer);

		// 删除笔记，并添加点击事件
		var noteDelete = $("<a></a>").attr("href", "javascript:;").addClass(
				"i_delete").addClass("fr").click(function() {

			notedb.remove(videoId, nodeId);
			$(this).parent().parent().remove();

		});
		noteDelete.appendTo(playTime);

		// 笔记内容信息
		$("<p></p>").addClass("note_info").html(text).appendTo(noteContainer);

		noteContainer.appendTo("#noteSet");
	}

	// 获得当前播放视频对象
	function getCurrentPlayer() {
		var currentVideoId = getCurrentVideoId();
		var playerId = $("#" + currentVideoId).attr("playerId");
		var currentPlayer = document.getElementById(playerId);
		return currentPlayer;
	}

	// 获得当前播放视频的id
	function getCurrentVideoId() {
		var currentVideoId = $("#currentVideo").val();
		return currentVideoId;
	}

	// 将记录课堂笔记时的视频时间转换为字符串以显示在界面上
	function convertTimeToString(inputTime) {
		var time = Math.floor(inputTime);
		var minute = time / 60;
		var minuteStr = minute.toString();
		minuteStr = minuteStr.split(".");
		minuteStr = minuteStr[0];

		var second = time % 60;
		if (second < 10) {
			second = "0" + second;
		}
		if (minuteStr < 10) {
			minuteStr = "0" + minuteStr;
		}
		return minuteStr + ":" + second;
	}

	// 将界面上记录课堂笔记时的时间字符串转换为视频时间
	function convertStringToTime(str) {
		var splitStrings = str.split(":", 2);
		var minutes = new Number(splitStrings[0]);
		var seconds = new Number(splitStrings[1]);
		var times = minutes * 60 + seconds;
		return times;
	}

	// 自动播放第一个视频
	$($("[videoId]")[0]).click();
});
