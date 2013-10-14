function TextReader(file,onFinish) {
	this.file = file;
	this.onFinish = onFinish;
}

TextReader.prototype.read = function()
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", this.file, true);
    var that = this;
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
            if(rawFile.status === 200 || rawFile.status == 0)
            	that.onFinish(rawFile.responseText);
    }
    rawFile.send(null);
}
