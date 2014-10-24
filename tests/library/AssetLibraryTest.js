var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var AssetEvent = require("awayjs-core/lib/events/AssetEvent");
var LoaderEvent = require("awayjs-core/lib/events/LoaderEvent");
var AssetLibrary = require("awayjs-core/lib/library/AssetLibrary");
var URLRequest = require("awayjs-core/lib/net/URLRequest");
var ParserBase = require("awayjs-core/lib/parsers/ParserBase");
var ParserDataFormat = require("awayjs-core/lib/parsers/ParserDataFormat");
var AssetLibraryTest = (function () {
    function AssetLibraryTest() {
        var _this = this;
        this.height = 0;
        AssetLibrary.enableParser(JSONTextureParser);
        this.token = AssetLibrary.load(new URLRequest('assets/JSNParserTest.json'));
        this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        this.token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
        this.token = AssetLibrary.load(new URLRequest('assets/1024x1024.png'));
        this.token.addEventListener(LoaderEvent.RESOURCE_COMPLETE, function (event) { return _this.onResourceComplete(event); });
        this.token.addEventListener(AssetEvent.ASSET_COMPLETE, function (event) { return _this.onAssetComplete(event); });
    }
    AssetLibraryTest.prototype.onAssetComplete = function (event) {
        console.log('------------------------------------------------------------------------------');
        console.log('AssetEvent.ASSET_COMPLETE', AssetLibrary.getAsset(event.asset.name));
        console.log('------------------------------------------------------------------------------');
        var imageTexture = AssetLibrary.getAsset(event.asset.name);
        document.body.appendChild(imageTexture.htmlImageElement);
        imageTexture.htmlImageElement.style.position = 'absolute';
        imageTexture.htmlImageElement.style.top = this.height + 'px';
        this.height += (imageTexture.htmlImageElement.height + 10);
    };
    AssetLibraryTest.prototype.onResourceComplete = function (event) {
        var loader = event.target;
        console.log('------------------------------------------------------------------------------');
        console.log('LoaderEvent.RESOURCE_COMPLETE', event);
        console.log('------------------------------------------------------------------------------');
    };
    return AssetLibraryTest;
})();
/**
* ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
* a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
* exception cases.
*/
var JSONTextureParser = (function (_super) {
    __extends(JSONTextureParser, _super);
    /**
     * Creates a new ImageParser object.
     * @param uri The url or id of the data or file to be parsed.
     * @param extra The holder for extra contextual data that the parser might need.
     */
    function JSONTextureParser() {
        _super.call(this, ParserDataFormat.PLAIN_TEXT);
        this.STATE_PARSE_DATA = 0;
        this.STATE_LOAD_IMAGES = 1;
        this.STATE_COMPLETE = 2;
        this._state = -1;
        this._dependencyCount = 0;
        this._loadedTextures = new Array();
        this._state = this.STATE_PARSE_DATA;
    }
    /**
     * Indicates whether or not a given file extension is supported by the parser.
     * @param extension The file extension of a potential file to be parsed.
     * @return Whether or not the given file type is supported.
     */
    JSONTextureParser.supportsType = function (extension) {
        extension = extension.toLowerCase();
        return extension == "json";
    };
    /**
     * Tests whether a data block can be parsed by the parser.
     * @param data The data block to potentially be parsed.
     * @return Whether or not the given data is supported.
     */
    JSONTextureParser.supportsData = function (data) {
        try {
            var obj = JSON.parse(data);
            if (obj)
                return true;
            return false;
        }
        catch (e) {
            return false;
        }
        return false;
    };
    /**
     * @inheritDoc
     */
    JSONTextureParser.prototype._iResolveDependency = function (resourceDependency) {
        var resource = resourceDependency.assets[0];
        this._pFinalizeAsset(resource, resourceDependency._iLoader.url);
        this._loadedTextures.push(resource);
        //console.log( 'JSONTextureParser._iResolveDependency' , resourceDependency );
        //console.log( 'JSONTextureParser._iResolveDependency resource: ' , resource );
        this._dependencyCount--;
        if (this._dependencyCount == 0)
            this._state = this.STATE_COMPLETE;
    };
    /**
     * @inheritDoc
     */
    JSONTextureParser.prototype._iResolveDependencyFailure = function (resourceDependency) {
        this._dependencyCount--;
        if (this._dependencyCount == 0)
            this._state = this.STATE_COMPLETE;
    };
    JSONTextureParser.prototype.parseJson = function () {
        if (JSONTextureParser.supportsData(this.data)) {
            try {
                var json = JSON.parse(this.data);
                var data = json.data;
                var rec;
                var rq;
                for (var c = 0; c < data.length; c++) {
                    rec = data[c];
                    var uri = rec.image;
                    var id = rec.id;
                    rq = new URLRequest(uri);
                    this._pAddDependency('JSON_ID_' + id, rq, false, null, true);
                }
                this._dependencyCount = data.length;
                this._state = this.STATE_LOAD_IMAGES;
                this._pPauseAndRetrieveDependencies();
            }
            catch (e) {
                this._state = this.STATE_COMPLETE;
            }
        }
    };
    /**
     * @inheritDoc
     */
    JSONTextureParser.prototype._pProceedParsing = function () {
        console.log('JSONTextureParser._pProceedParsing', this._state);
        switch (this._state) {
            case this.STATE_PARSE_DATA:
                this.parseJson();
                return ParserBase.MORE_TO_PARSE;
                break;
            case this.STATE_LOAD_IMAGES:
                break;
            case this.STATE_COMPLETE:
                return ParserBase.PARSING_DONE;
                break;
        }
        return ParserBase.MORE_TO_PARSE;
    };
    return JSONTextureParser;
})(ParserBase);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYnJhcnkvYXNzZXRsaWJyYXJ5dGVzdC50cyJdLCJuYW1lcyI6WyJBc3NldExpYnJhcnlUZXN0IiwiQXNzZXRMaWJyYXJ5VGVzdC5jb25zdHJ1Y3RvciIsIkFzc2V0TGlicmFyeVRlc3Qub25Bc3NldENvbXBsZXRlIiwiQXNzZXRMaWJyYXJ5VGVzdC5vblJlc291cmNlQ29tcGxldGUiLCJKU09OVGV4dHVyZVBhcnNlciIsIkpTT05UZXh0dXJlUGFyc2VyLmNvbnN0cnVjdG9yIiwiSlNPTlRleHR1cmVQYXJzZXIuc3VwcG9ydHNUeXBlIiwiSlNPTlRleHR1cmVQYXJzZXIuc3VwcG9ydHNEYXRhIiwiSlNPTlRleHR1cmVQYXJzZXIuX2lSZXNvbHZlRGVwZW5kZW5jeSIsIkpTT05UZXh0dXJlUGFyc2VyLl9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlIiwiSlNPTlRleHR1cmVQYXJzZXIucGFyc2VKc29uIiwiSlNPTlRleHR1cmVQYXJzZXIuX3BQcm9jZWVkUGFyc2luZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBTyxVQUFVLFdBQWEsbUNBQW1DLENBQUMsQ0FBQztBQUNuRSxJQUFPLFdBQVcsV0FBYSxvQ0FBb0MsQ0FBQyxDQUFDO0FBRXJFLElBQU8sWUFBWSxXQUFhLHNDQUFzQyxDQUFDLENBQUM7QUFJeEUsSUFBTyxVQUFVLFdBQWEsZ0NBQWdDLENBQUMsQ0FBQztBQUdoRSxJQUFPLFVBQVUsV0FBYSxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ3BFLElBQU8sZ0JBQWdCLFdBQVksMENBQTBDLENBQUMsQ0FBQztBQUcvRSxJQUFNLGdCQUFnQjtJQU1yQkEsU0FOS0EsZ0JBQWdCQTtRQUF0QkMsaUJBa0RDQTtRQS9DUUEsV0FBTUEsR0FBWUEsQ0FBQ0EsQ0FBQ0E7UUFNM0JBLFlBQVlBLENBQUNBLFlBQVlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsQ0FBRUE7UUFFOUNBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLFlBQVlBLENBQUNBLElBQUlBLENBQUNBLElB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QUFDQTtJQUNETjs7T0FFR0E7SUFDSUEsNENBQWdCQSxHQUF2QkE7UUFFQ08sT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBRUEsb0NBQW9DQSxFQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFFQSxDQUFDQTtRQUVsRUEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDckJBLEtBQUtBLElBQUlBLENBQUNBLGdCQUFnQkE7Z0JBQ3pCQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtnQkFDakJBLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLGFBQWFBLENBQUNBO2dCQUNoQ0EsS0FBS0EsQ0FBQ0E7WUFDUEEsS0FBS0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQTtnQkFDMUJBLEtBQUtBLENBQUNBO1lBQ1BBLEtBQUtBLElBQUlBLENBQUNBLGNBQWNBO2dCQUN2QkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsWUFBWUEsQ0FBQ0E7Z0JBQy9CQSxLQUFLQSxDQUFDQTtRQUNSQSxDQUFDQTtRQUVEQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQSxhQUFhQSxDQUFDQTtJQUNqQ0EsQ0FBQ0E7SUFDRlAsd0JBQUNBO0FBQURBLENBN0lBLEFBNklDQSxFQTdJK0IsVUFBVSxFQTZJekMiLCJmaWxlIjoibGlicmFyeS9Bc3NldExpYnJhcnlUZXN0LmpzIiwic291cmNlUm9vdCI6Ii4vdGVzdHMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQXNzZXRFdmVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvQXNzZXRFdmVudFwiKTtcbmltcG9ydCBMb2FkZXJFdmVudFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9ldmVudHMvTG9hZGVyRXZlbnRcIik7XG5pbXBvcnQgUGFyc2VyRXZlbnRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL1BhcnNlckV2ZW50XCIpO1xuaW1wb3J0IEFzc2V0TGlicmFyeVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TGlicmFyeVwiKTtcbmltcG9ydCBBc3NldExvYWRlclx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0Fzc2V0TG9hZGVyXCIpO1xuaW1wb3J0IEFzc2V0TG9hZGVyVG9rZW5cdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL2xpYnJhcnkvQXNzZXRMb2FkZXJUb2tlblwiKTtcbmltcG9ydCBJQXNzZXRcdFx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L0lBc3NldFwiKTtcbmltcG9ydCBVUkxSZXF1ZXN0XHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL25ldC9VUkxSZXF1ZXN0XCIpO1xuaW1wb3J0IEltYWdlVGV4dHVyZVx0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi90ZXh0dXJlcy9JbWFnZVRleHR1cmVcIik7XG5pbXBvcnQgVGV4dHVyZTJEQmFzZVx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvdGV4dHVyZXMvVGV4dHVyZTJEQmFzZVwiKTtcbmltcG9ydCBQYXJzZXJCYXNlXHRcdFx0PSByZXF1aXJlKFwiYXdheWpzLWNvcmUvbGliL3BhcnNlcnMvUGFyc2VyQmFzZVwiKTtcbmltcG9ydCBQYXJzZXJEYXRhRm9ybWF0XHRcdD0gcmVxdWlyZShcImF3YXlqcy1jb3JlL2xpYi9wYXJzZXJzL1BhcnNlckRhdGFGb3JtYXRcIik7XG5pbXBvcnQgUmVzb3VyY2VEZXBlbmRlbmN5XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvcGFyc2Vycy9SZXNvdXJjZURlcGVuZGVuY3lcIik7XG5cbmNsYXNzIEFzc2V0TGlicmFyeVRlc3RcbntcblxuXHRwcml2YXRlIGhlaWdodCA6IG51bWJlciA9IDA7XG5cblx0cHJpdmF0ZSB0b2tlbiA6IEFzc2V0TG9hZGVyVG9rZW47XG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXG5cdFx0QXNzZXRMaWJyYXJ5LmVuYWJsZVBhcnNlcihKU09OVGV4dHVyZVBhcnNlcikgO1xuXG5cdFx0dGhpcy50b2tlbiA9IEFzc2V0TGlicmFyeS5sb2FkKG5ldyBVUkxSZXF1ZXN0KCdhc3NldHMvSlNOUGFyc2VyVGVzdC5qc29uJykgKTtcblx0XHR0aGlzLnRva2VuLmFkZEV2ZW50TGlzdGVuZXIoIExvYWRlckV2ZW50LlJFU09VUkNFX0NPTVBMRVRFICwgKGV2ZW50OkxvYWRlckV2ZW50KSA9PiB0aGlzLm9uUmVzb3VyY2VDb21wbGV0ZShldmVudCkgKTtcblx0XHR0aGlzLnRva2VuLmFkZEV2ZW50TGlzdGVuZXIoQXNzZXRFdmVudC5BU1NFVF9DT01QTEVURSAsIChldmVudDpBc3NldEV2ZW50KSA9PiB0aGlzLm9uQXNzZXRDb21wbGV0ZShldmVudCkgKTtcblxuXHRcdHRoaXMudG9rZW4gPSBBc3NldExpYnJhcnkubG9hZChuZXcgVVJMUmVxdWVzdCgnYXNzZXRzLzEwMjR4MTAyNC5wbmcnKSApO1xuXHRcdHRoaXMudG9rZW4uYWRkRXZlbnRMaXN0ZW5lciggTG9hZGVyRXZlbnQuUkVTT1VSQ0VfQ09NUExFVEUgLCAoZXZlbnQ6TG9hZGVyRXZlbnQpID0+IHRoaXMub25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50KSApO1xuXHRcdHRoaXMudG9rZW4uYWRkRXZlbnRMaXN0ZW5lcihBc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFICwgKGV2ZW50OkFzc2V0RXZlbnQpID0+IHRoaXMub25Bc3NldENvbXBsZXRlKGV2ZW50KSApO1xuXG5cdH1cblxuXHRwdWJsaWMgb25Bc3NldENvbXBsZXRlKGV2ZW50OkFzc2V0RXZlbnQpXG5cdHtcblxuXHRcdGNvbnNvbGUubG9nKCAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coICdBc3NldEV2ZW50LkFTU0VUX0NPTVBMRVRFJyAsIEFzc2V0TGlicmFyeS5nZXRBc3NldChldmVudC5hc3NldC5uYW1lKSApO1xuXHRcdGNvbnNvbGUubG9nKCAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cblx0XHR2YXIgaW1hZ2VUZXh0dXJlIDogSW1hZ2VUZXh0dXJlID0gPEltYWdlVGV4dHVyZT4gQXNzZXRMaWJyYXJ5LmdldEFzc2V0KGV2ZW50LmFzc2V0Lm5hbWUpO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggaW1hZ2VUZXh0dXJlLmh0bWxJbWFnZUVsZW1lbnQgKTtcblxuXHRcdGltYWdlVGV4dHVyZS5odG1sSW1hZ2VFbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRpbWFnZVRleHR1cmUuaHRtbEltYWdlRWxlbWVudC5zdHlsZS50b3AgPSB0aGlzLmhlaWdodCArICdweCc7XG5cblxuXHRcdHRoaXMuaGVpZ2h0ICs9ICggaW1hZ2VUZXh0dXJlLmh0bWxJbWFnZUVsZW1lbnQuaGVpZ2h0ICsgMTAgKSA7XG5cblx0fVxuXHRwdWJsaWMgb25SZXNvdXJjZUNvbXBsZXRlKGV2ZW50OkxvYWRlckV2ZW50KVxuXHR7XG5cblx0XHR2YXIgbG9hZGVyIDogQXNzZXRMb2FkZXIgPSA8QXNzZXRMb2FkZXI+IGV2ZW50LnRhcmdldDtcblxuXHRcdGNvbnNvbGUubG9nKCAnLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tJyk7XG5cdFx0Y29uc29sZS5sb2coICdMb2FkZXJFdmVudC5SRVNPVVJDRV9DT01QTEVURScgLCBldmVudCAgKTtcblx0XHRjb25zb2xlLmxvZyggJy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLScpO1xuXG5cdH1cblxufVxuXG4vKipcbiogSW1hZ2VQYXJzZXIgcHJvdmlkZXMgYSBcInBhcnNlclwiIGZvciBuYXRpdmVseSBzdXBwb3J0ZWQgaW1hZ2UgdHlwZXMgKGpwZywgcG5nKS4gV2hpbGUgaXQgc2ltcGx5IGxvYWRzIGJ5dGVzIGludG9cbiogYSBsb2FkZXIgb2JqZWN0LCBpdCB3cmFwcyBpdCBpbiBhIEJpdG1hcERhdGFSZXNvdXJjZSBzbyByZXNvdXJjZSBtYW5hZ2VtZW50IGNhbiBoYXBwZW4gY29uc2lzdGVudGx5IHdpdGhvdXRcbiogZXhjZXB0aW9uIGNhc2VzLlxuKi9cbmNsYXNzIEpTT05UZXh0dXJlUGFyc2VyIGV4dGVuZHMgUGFyc2VyQmFzZVxue1xuXHRwcml2YXRlIFNUQVRFX1BBUlNFX0RBVEE6bnVtYmVyID0gMDtcblx0cHJpdmF0ZSBTVEFURV9MT0FEX0lNQUdFUzpudW1iZXIgPSAxO1xuXHRwcml2YXRlIFNUQVRFX0NPTVBMRVRFOm51bWJlciA9IDI7XG5cblx0cHJpdmF0ZSBfc3RhdGU6bnVtYmVyID0gLTE7XG5cdHByaXZhdGUgX3N0YXJ0ZWRQYXJzaW5nOmJvb2xlYW47XG5cdHByaXZhdGUgX2RvbmVQYXJzaW5nOmJvb2xlYW47XG5cdHByaXZhdGUgX2RlcGVuZGVuY3lDb3VudDpudW1iZXIgPSAwO1xuXHRwcml2YXRlIF9sb2FkZWRUZXh0dXJlczpBcnJheTxUZXh0dXJlMkRCYXNlPjtcblxuXHQvKipcblx0ICogQ3JlYXRlcyBhIG5ldyBJbWFnZVBhcnNlciBvYmplY3QuXG5cdCAqIEBwYXJhbSB1cmkgVGhlIHVybCBvciBpZCBvZiB0aGUgZGF0YSBvciBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHBhcmFtIGV4dHJhIFRoZSBob2xkZXIgZm9yIGV4dHJhIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBwYXJzZXIgbWlnaHQgbmVlZC5cblx0ICovXG5cdGNvbnN0cnVjdG9yKClcblx0e1xuXHRcdHN1cGVyKFBhcnNlckRhdGFGb3JtYXQuUExBSU5fVEVYVCk7XG5cblx0XHR0aGlzLl9sb2FkZWRUZXh0dXJlcyA9IG5ldyBBcnJheTxUZXh0dXJlMkRCYXNlPigpO1xuXHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9QQVJTRV9EQVRBO1xuXHR9XG5cblx0LyoqXG5cdCAqIEluZGljYXRlcyB3aGV0aGVyIG9yIG5vdCBhIGdpdmVuIGZpbGUgZXh0ZW5zaW9uIGlzIHN1cHBvcnRlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZXh0ZW5zaW9uIFRoZSBmaWxlIGV4dGVuc2lvbiBvZiBhIHBvdGVudGlhbCBmaWxlIHRvIGJlIHBhcnNlZC5cblx0ICogQHJldHVybiBXaGV0aGVyIG9yIG5vdCB0aGUgZ2l2ZW4gZmlsZSB0eXBlIGlzIHN1cHBvcnRlZC5cblx0ICovXG5cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c1R5cGUoZXh0ZW5zaW9uIDogc3RyaW5nKSA6IGJvb2xlYW5cblx0e1xuXHRcdGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuXHRcdHJldHVybiBleHRlbnNpb24gPT0gXCJqc29uXCI7XG5cdH1cblxuXHQvKipcblx0ICogVGVzdHMgd2hldGhlciBhIGRhdGEgYmxvY2sgY2FuIGJlIHBhcnNlZCBieSB0aGUgcGFyc2VyLlxuXHQgKiBAcGFyYW0gZGF0YSBUaGUgZGF0YSBibG9jayB0byBwb3RlbnRpYWxseSBiZSBwYXJzZWQuXG5cdCAqIEByZXR1cm4gV2hldGhlciBvciBub3QgdGhlIGdpdmVuIGRhdGEgaXMgc3VwcG9ydGVkLlxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBzdXBwb3J0c0RhdGEoZGF0YSA6IGFueSkgOiBib29sZWFuXG5cdHtcblx0XHR0cnkge1xuXHRcdFx0dmFyIG9iaiA9IEpTT04ucGFyc2UoZGF0YSk7XG5cblx0XHRcdGlmIChvYmopXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fSBjYXRjaCAoIGUgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX2lSZXNvbHZlRGVwZW5kZW5jeShyZXNvdXJjZURlcGVuZGVuY3k6UmVzb3VyY2VEZXBlbmRlbmN5KVxuXHR7XG5cdFx0dmFyIHJlc291cmNlIDogVGV4dHVyZTJEQmFzZSA9IDxUZXh0dXJlMkRCYXNlPiByZXNvdXJjZURlcGVuZGVuY3kuYXNzZXRzWzBdO1xuXG5cdFx0dGhpcy5fcEZpbmFsaXplQXNzZXQoPElBc3NldD4gcmVzb3VyY2UsIHJlc291cmNlRGVwZW5kZW5jeS5faUxvYWRlci51cmwpO1xuXG5cdFx0dGhpcy5fbG9hZGVkVGV4dHVyZXMucHVzaCggcmVzb3VyY2UgKTtcblxuXHRcdC8vY29uc29sZS5sb2coICdKU09OVGV4dHVyZVBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5JyAsIHJlc291cmNlRGVwZW5kZW5jeSApO1xuXHRcdC8vY29uc29sZS5sb2coICdKU09OVGV4dHVyZVBhcnNlci5faVJlc29sdmVEZXBlbmRlbmN5IHJlc291cmNlOiAnICwgcmVzb3VyY2UgKTtcblxuXHRcdHRoaXMuX2RlcGVuZGVuY3lDb3VudC0tO1xuXG5cdFx0aWYgKCB0aGlzLl9kZXBlbmRlbmN5Q291bnQgPT0gMClcblx0XHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9DT01QTEVURTtcblx0fVxuXG5cdC8qKlxuXHQgKiBAaW5oZXJpdERvY1xuXHQgKi9cblx0cHVibGljIF9pUmVzb2x2ZURlcGVuZGVuY3lGYWlsdXJlKHJlc291cmNlRGVwZW5kZW5jeTpSZXNvdXJjZURlcGVuZGVuY3kpXG5cdHtcblx0XHR0aGlzLl9kZXBlbmRlbmN5Q291bnQtLTtcblxuXHRcdGlmICggdGhpcy5fZGVwZW5kZW5jeUNvdW50ID09IDApXG5cdFx0XHR0aGlzLl9zdGF0ZSA9IHRoaXMuU1RBVEVfQ09NUExFVEU7XG5cdH1cblxuXHRwcml2YXRlIHBhcnNlSnNvbiggKSA6IHZvaWRcblx0e1xuXHRcdGlmIChKU09OVGV4dHVyZVBhcnNlci5zdXBwb3J0c0RhdGEodGhpcy5kYXRhKSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dmFyIGpzb246YW55ID0gSlNPTi5wYXJzZSh0aGlzLmRhdGEpO1xuXHRcdFx0XHR2YXIgZGF0YTpBcnJheTxhbnk+ID0gPEFycmF5PGFueT4+IGpzb24uZGF0YTtcblxuXHRcdFx0XHR2YXIgcmVjOmFueTtcblx0XHRcdFx0dmFyIHJxOlVSTFJlcXVlc3Q7XG5cblx0XHRcdFx0Zm9yICh2YXIgYyA6IG51bWJlciA9IDA7IGMgPCBkYXRhLmxlbmd0aDsgYyArKykge1xuXHRcdFx0XHRcdHJlYyA9IGRhdGFbY107XG5cblx0XHRcdFx0XHR2YXIgdXJpOnN0cmluZyA9IDxzdHJpbmc+IHJlYy5pbWFnZTtcblx0XHRcdFx0XHR2YXIgaWQ6c3RyaW5nID0gPHN0cmluZz4gcmVjLmlkO1xuXG5cdFx0XHRcdFx0cnEgPSBuZXcgVVJMUmVxdWVzdCh1cmkpO1xuXG5cdFx0XHRcdFx0dGhpcy5fcEFkZERlcGVuZGVuY3koJ0pTT05fSURfJyArIGlkLCBycSwgZmFsc2UsIG51bGwsIHRydWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dGhpcy5fZGVwZW5kZW5jeUNvdW50ID0gZGF0YS5sZW5ndGg7XG5cdFx0XHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9MT0FEX0lNQUdFUztcblxuXHRcdFx0XHR0aGlzLl9wUGF1c2VBbmRSZXRyaWV2ZURlcGVuZGVuY2llcygpO1xuXG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdHRoaXMuX3N0YXRlID0gdGhpcy5TVEFURV9DT01QTEVURTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0LyoqXG5cdCAqIEBpbmhlcml0RG9jXG5cdCAqL1xuXHRwdWJsaWMgX3BQcm9jZWVkUGFyc2luZygpIDogYm9vbGVhblxuXHR7XG5cdFx0Y29uc29sZS5sb2coICdKU09OVGV4dHVyZVBhcnNlci5fcFByb2NlZWRQYXJzaW5nJyAsIHRoaXMuX3N0YXRlICk7XG5cblx0XHRzd2l0Y2ggKHRoaXMuX3N0YXRlKSB7XG5cdFx0XHRjYXNlIHRoaXMuU1RBVEVfUEFSU0VfREFUQTpcblx0XHRcdFx0dGhpcy5wYXJzZUpzb24oKTtcblx0XHRcdFx0cmV0dXJuIFBhcnNlckJhc2UuTU9SRV9UT19QQVJTRTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRjYXNlIHRoaXMuU1RBVEVfTE9BRF9JTUFHRVM6XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0Y2FzZSB0aGlzLlNUQVRFX0NPTVBMRVRFOlxuXHRcdFx0XHRyZXR1cm4gUGFyc2VyQmFzZS5QQVJTSU5HX0RPTkU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdH1cblxuXHRcdHJldHVybiBQYXJzZXJCYXNlLk1PUkVfVE9fUEFSU0U7XG5cdH1cbn0iXX0=