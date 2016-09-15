function Journal(){
	this.collection = [];
	this.addNewEntry = function(title, content, author, timestamp){
		this.collection.push(new Entry(title, content, author, timestamp));
	}
	this.addExistingEntry = function(entry){
		// if ... ( need something to check if the user input is actually Entry Object )
		this.collection.push(entry);
	}
	this.displayEntries = function(){
		for (var i = 0; i < this.collection.length; i ++){
			console.log(this.collection[i]);
		}
	}
	this.withTag = function(etag){ 
		// find entries within the journal with specific tag
		var taggedEn = [];
		for (var i = 0; i < this.collection.length; i++){
			for (var j = 0; j<this.collection[i].tags.length; j++){
				if (this.collection[i].tags[j].includes(etag)) {
				taggedEn.push(this.collection[i]);
				}
			}
		}
		console.log(taggedEn);
		return taggedEn;
	}
	this.withString = function(estr){ 
		// find entries containing specific string
		var strList = [];
		for (var i = 0; i < this.collection.length; i++){
			if ((this.collection[i].title.includes(estr)) || (this.collection[i].content.includes(estr))){ //check if title or content of the entry contains certain string
				strList.push(this.collection[i]);
			}
		}	
		console.log(strList);
		return strList;
	}
	this.deleteEntry = function(entry){ 
		// delete an specific entry 
		var ind = this.collection.indexof(entry);
		this.collection.splice(ind, 0);
	}
}

function Entry(title, content, author, timestamp){
	this.title = title;
	this.content = content;
	this.author = author;
	this.timestamp = timestamp;
	this.tags = [];
}


	