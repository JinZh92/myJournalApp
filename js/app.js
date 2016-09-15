//  ** R E V I E W ** 

// Great journal. Many nice little touches both aesthetically and functionally. I like
// the menus that appear over the content, the watercolor-y background on each entry,
// the scroll effect on the header & alternating entry colors.

// Again, you're doing a great job using indentation and comments to keep your code
// clean and organized.

// I was having an issue with being unable to close entries after viewing them but
// you have fixed that in your latest push to GitHub :)

// Overall this is one of the best in the class!



$(document).ready(function(){

//----------------Load the saved content at startup-------------//
	if (localStorage.getItem("myEntries") === null){
		var myEntries = [];
	} else{
		var myEntries = JSON.parse(localStorage.getItem('myEntries'));
	}

	//load initial content stored.
    if (myEntries.length == 0){
        var iniHtml = '<h3 id="iniHtml">Oops... <br>You don\'t seem to have anything here. <br>Try writing something first! ^_^</h3>';
        $('#content').html(iniHtml);
    } else{
        displayHtml();
    }
	

	// create Journal Object based on myEntries
	var myJournal = new Journal();
	for (var i=0; i<myEntries.length; i++) {
		myJournal.addExistingEntry(myEntries[i]);
	}

	$('#hidewelcome').click(function(){
		// $('#welcome').addClass('hide');
		// $('#welcome').slideUp("slow");
		$('#welcome').fadeOut();
		setTimeout(function(){
			$('#wrapper').removeClass('hide');
		}, 400);
	})
	$('#back-home').click(function(){
		$('#wrapper').addClass('hide');
		setTimeout(function(){
			$('#welcome').fadeIn();
		}, 200);
	})

//---------------Displaying html based on current myEntries------------//
    function displayHtml(){
        var contentHtml = '';
        for (var i=0; i<myEntries.length; i++){
            contentHtml = '<section><div class="container"><h1>' + myEntries[i].title + '</h1><span class="subcont">Created on: ' + myEntries[i].timestamp + '</span><p class="postcontent">' + myEntries[i].content + '</p><span class="subcont">Tags: ' + myEntries[i].tags + '</span><a class="contentview" id="' + 'c' + myEntries[i].timestamp + '" href="#">View/Edit/Delete</a></div></section>' + contentHtml;
            
        } // the view/edit/delete link will have a unique id of char "c" + its timestamp for each post
        $('#content').html(contentHtml);
        showmoreshowless(); // function hide the content paragraph if the length is greater than a threshold.

        $('.contentview').click(function(e){
            e.preventDefault;
            var tswithc = e.target.id; // !Important Get the id of the element that triggered the event
            // this gives id of the timestamp with an extra "c" in front of it
            var tswithoutc = tswithc.substring(1); //slice did not work, instead used substring
            var contentEntry;
            contentEntry = findbyTS(tswithoutc);
            console.log(contentEntry);
            showInSingle(contentEntry);
            $('#single-entry').fadeIn();
        })
    }

//--------------------Header size change after scrolling a set distance--------------------//
    $(window).scroll(function() {
	    if($(this).scrollTop() >= 180){
	        $('header').addClass('smaller')
            $('img').fadeOut();
	    } else {
	    	if ($('header').hasClass('smaller')){
	    		$('header').removeClass('smaller');
                $('img').fadeIn();
	    	}
	    }
	})

//-----------------Show More/Show Less Function-----------//
   function showmoreshowless(){
    	var showChar = 70;  // How many characters are shown by default
	    var ellipsestext = "...";
	    var moretext = "Read more >";
	    var lesstext = "Show less";
	    
	    $('.postcontent').each(function() {
	        var content = $(this).html();
	 
	        if(content.length > showChar) {	 
	            var c = content.substr(0, showChar);
	            var h = content.substr(showChar, content.length - showChar);
	            var html = c + '<span class="moreellipses hiddenwhite">' + ellipsestext+ '&nbsp;</span><span class="morecontent hiddenwhite"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
	 
	            $(this).html(html);
	        }	 
	    });
	 
	    $(".morelink").click(function(){
	        if($(this).hasClass("less")) {
	            $(this).removeClass("less");
	            $(this).html(moretext);
	        } else {
	            $(this).addClass("less");
	            $(this).html(lesstext);
	        }
	        $(this).parent().prev().toggle();
	        $(this).prev().toggle();
	        return false;
	    });
    }


//---------------Function that update the single entry page for each one--------//
    function showInSingle(entry){
    	$('#single-title').html(entry.title);
    	$('#single-author').html(entry.author);
    	$('#single-timestamp').html(entry.timestamp);
    	$('#single-body').html(entry.content);
    	$('#single-tags').html(entry.tags);

    }
//------------Find corrresponding Entry based on timestamp given----------//
    function findbyTS(ts){
    	var resultbyTS;
    	for (var i = 0; i < myJournal.collection.length; i++){
    		if (myJournal.collection[i].timestamp === ts) {
    			resultbyTS = myJournal.collection[i];
    		}
    	}
    	return resultbyTS; // type is an entry
    }

//-----------Delete an entry from both the myEntry and Journal---------//
    function delEntry(entry){
        var indEntries = $.inArray(entry, myEntries);
        // var indEntries = myEntries.indexof(entry);
        console.log(indEntries);
        if (indEntries != (-1)){
            myEntries.splice(indEntries, 1);
        }
        var indJournal = $.inArray(entry, myJournal.collection);
        // var indJournal = myJournal.collection.indexof(entry);
        if (indJournal != (-1)){
            myJournal.collection.splice(indJournal, 1);
        }    
        var myEntriesStr = JSON.stringify(myEntries);
        localStorage.setItem('myEntries', myEntriesStr);
    }


//---------------------New Entry Page----------------------//
    $('#write-entry').click(function(){
    	$('#new-entry').fadeIn();
    })
    $('#cancel-creation').click(function(e){
    	e.preventDefault();
    	$('#new-entry').fadeOut();
    })
    $('#submit-post').click(function(e){
    	e.preventDefault();
    	var title = $('#title').val();
    	var content = $('#entrytext').val();
    	var author = $('#author').val();
    	var tagsinput = $('#tags').val();
    	var tags = tagsinput.split(','); //single or double quote?

    	var dt = new Date();
    	// return current time, with the format being "Y/M/D H:M:S"
    	var today = dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
    	var hours = dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds();
    	var timestamp = today + '_' + hours;

    	var myNewEntry = new Entry(title, content, author, timestamp);
    	for (var i=0; i<tags.length; i++){
    		myNewEntry.tags.push(tags[i]);
    	}

    	myEntries.push(myNewEntry);
    	myJournal.addExistingEntry(myNewEntry);

    	var myEntriesStr = JSON.stringify(myEntries);
    	localStorage.setItem('myEntries', myEntriesStr);
    	
    	//show the contents of entries
    	displayHtml();

    	setTimeout(function(){
    		alert('A new post has been made!');
			$('#new-entry').fadeOut();
		}, 200);
    	setTimeout(function(){
			$('#creationform').trigger("reset");
		}, 250);
 

    })



//---------------------Search Page---------------------//

    $('#start-search').click(function(){
    	$('#new-search').fadeIn();
    })
    $('#cancel-search').click(function(e){
		e.preventDefault();
		$('#new-search').fadeOut();
		$('#searchform').trigger("reset");
    })
    $('#submit-search').click(function(e){
    	e.preventDefault();
    	var searchStr = $('#searchInput').val();
    	var result;

    	var checkedvar = $("input[name='searchMethod']:checked").val();
    	if (checkedvar === 'byTag'){
    		result = myJournal.withTag(searchStr);
    	} else if(checkedvar === 'byStr'){
    		result = myJournal.withString(searchStr);
    	} else{
    		alert('Please select a search condition!');
    	}

    	// print result to the screen
    	var resultHtml = ''
    	if (result.length === 0){
    		resultHtml = "No result has been found! Try changing your search condition."
    	} else{
    		for (var i = 0; i<result.length; i++){
    			resultHtml += '<tr><td>';
    			resultHtml += result[i].title;
    			resultHtml += '</td><td>';
    			resultHtml += result[i].author;
    			resultHtml += '</td><td>';
    			resultHtml += result[i].timestamp;
    			resultHtml += '</td><td>';
    			resultHtml += result[i].tags;
    			resultHtml += '</td><td><a id="';
    			resultHtml += result[i].timestamp;
    			resultHtml += '" class="search-link" href="">View</a></td></tr>';
    		}
    	}

    	$('#result-table-body').html(resultHtml);

    	setTimeout(function(){
			$('#new-search').fadeOut();
		}, 200);

    	setTimeout(function(){
			$('#search-result').fadeIn();
		}, 220);


        // upon clicking the view button on the search result screen, it will find the correct id and open the single entry page
        $('.search-link').click(function(e){
            e.preventDefault();
            var targetts = e.target.id; // !Important Get the id of the element that triggered the event
            console.log(targetts);
            var targetEntry;
            targetEntry = findbyTS(targetts);
            showInSingle(targetEntry);
            $('#search-result').fadeOut();
            $('#single-entry').fadeIn();
        })

    })



//---------------------Result page-------------------------//
	$('#cancel-result').click(function(){
		$('#search-result').fadeOut();
		$('#searchform').trigger("reset");
	})
	$('#refine-search').click(function(){
		$('#search-result').fadeOut();
		$('#new-search').fadeIn();
	})

//--------------------Single Page Entry---------------------//

	$('.single-cancel').click(function(){
		$('#single-entry').fadeOut();
        $('#searchform').trigger("reset");
	})

    //delete from the single entry page
    $('.single-delete').click(function(){
        var conf = confirm("You are permanently deleting an entry!!");
        if (conf){
            var delts = $('#single-timestamp').text();
            var delentryobj;
            if (delts != '') {
                delentryobj = findbyTS(delts);
            }
            delEntry(delentryobj);
            displayHtml();
            $('#single-entry').fadeOut();
            $('#searchform').trigger("reset");
        }
        
    })

//-------------View/Edit/Delete button from the main page-----------//

    // $('.contentview').click(function(e){
    //         e.preventDefault();
    //     var tswithc = e.target.id; // !Important Get the id of the element that triggered the event
    //     console.log(tswithc); // this gives id of the timestamp with an extra "c" in front of it
    //     var tswithoutc = tswithc.substring(1); //slice did not work, instead used substring
    //     var contentEntry;
    //     contentEntry = findbyTS(tswithoutc);
    //     showInSingle(contentEntry);
    //     $('#single-entry').fadeIn();
    // });

//-------------Overview a list of titles-------------//
    $('#start-overview').click(function(){
        var overviewlist = '';
        for (var i = 0; i<myEntries.length; i++){
            overviewlist = '<li class="list-group-item">'+ myEntries[i].title +'</li>' + overviewlist;
        }
        $('.listtitles').html(overviewlist);
        if ($('.sidebar').hasClass('sidebaropen')){
            $('.sidebar').removeClass('sidebaropen');
        } else {
            $('.sidebar').addClass('sidebaropen');
        }



    })


})