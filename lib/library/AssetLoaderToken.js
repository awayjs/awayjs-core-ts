var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EventDispatcher = require("awayjs-core/lib/events/EventDispatcher");
/**
 * Dispatched when any asset finishes parsing. Also see specific events for each
 * individual asset type (meshes, materials et c.)
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="assetComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a full resource (including dependencies) finishes loading.
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="resourceComplete", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when a single dependency (which may be the main file of a resource)
 * finishes loading.
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="dependencyComplete", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when an error occurs during loading. I
 *
 * @eventType away.events.LoaderEvent
 */
//[Event(name="loadError", type="away3d.events.LoaderEvent")]
/**
 * Dispatched when an error occurs during parsing.
 *
 * @eventType away.events.ParserEvent
 */
//[Event(name="parseError", type="away3d.events.ParserEvent")]
/**
 * Dispatched when a skybox asset has been costructed from a ressource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="skyboxComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a camera3d asset has been costructed from a ressource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="cameraComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a mesh asset has been costructed from a ressource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="meshComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a geometry asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="geometryComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a skeleton asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="skeletonComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a skeleton pose asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="skeletonPoseComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a container asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="containerComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a texture asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="textureComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a texture projector asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="textureProjectorComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a material asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="materialComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when a animator asset has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animatorComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation set has been constructed from a group of animation state resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animationSetComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation state has been constructed from a group of animation node resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animationStateComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation node has been constructed from a resource.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="animationNodeComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an animation state transition has been constructed from a group of animation node resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="stateTransitionComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an light asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="lightComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an light picker asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="lightPickerComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an effect method asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="effectMethodComplete", type="away3d.events.AssetEvent")]
/**
 * Dispatched when an shadow map method asset has been constructed from a resources.
 *
 * @eventType away.events.AssetEvent
 */
//[Event(name="shadowMapMethodComplete", type="away3d.events.AssetEvent")]
/**
 * Instances of this class are returned as tokens by loading operations
 * to provide an object on which events can be listened for in cases where
 * the actual asset loader is not directly available (e.g. when using the
 * AssetLibrary to perform the load.)
 *
 * By listening for events on this class instead of directly on the
 * AssetLibrary, one can distinguish different loads from each other.
 *
 * The token will dispatch all events that the original AssetLoader dispatches,
 * while not providing an interface to obstruct the load and is as such a
 * safer return value for loader wrappers than the loader itself.
 */
var AssetLoaderToken = (function (_super) {
    __extends(AssetLoaderToken, _super);
    function AssetLoaderToken(loader) {
        _super.call(this);
        this._iLoader = loader;
    }
    AssetLoaderToken.prototype.addEventListener = function (type, listener) {
        this._iLoader.addEventListener(type, listener);
    };
    AssetLoaderToken.prototype.removeEventListener = function (type, listener) {
        this._iLoader.removeEventListener(type, listener);
    };
    AssetLoaderToken.prototype.hasEventListener = function (type, listener) {
        if (listener === void 0) { listener = null; }
        return this._iLoader.hasEventListener(type, listener);
    };
    return AssetLoaderToken;
})(EventDispatcher);
module.exports = AssetLoaderToken;

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF3YXlqcy1jb3JlL2xpYi9saWJyYXJ5L2Fzc2V0bG9hZGVydG9rZW4udHMiXSwibmFtZXMiOlsiQXNzZXRMb2FkZXJUb2tlbiIsIkFzc2V0TG9hZGVyVG9rZW4uY29uc3RydWN0b3IiLCJBc3NldExvYWRlclRva2VuLmFkZEV2ZW50TGlzdGVuZXIiLCJBc3NldExvYWRlclRva2VuLnJlbW92ZUV2ZW50TGlzdGVuZXIiLCJBc3NldExvYWRlclRva2VuLmhhc0V2ZW50TGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLElBQU8sZUFBZSxXQUFhLHdDQUF3QyxDQUFDLENBQUM7QUFFN0UsQUFzTUE7Ozs7O0dBak1HO0FBQ0gsZ0VBQWdFO0FBR2hFOzs7O0dBSUc7QUFDSCxvRUFBb0U7QUFHcEU7Ozs7O0dBS0c7QUFDSCxzRUFBc0U7QUFHdEU7Ozs7R0FJRztBQUNILDZEQUE2RDtBQUc3RDs7OztHQUlHO0FBQ0gsOERBQThEO0FBRzlEOzs7O0dBSUc7QUFDSCxpRUFBaUU7QUFFakU7Ozs7R0FJRztBQUNILGlFQUFpRTtBQUVqRTs7OztHQUlHO0FBQ0gsK0RBQStEO0FBRS9EOzs7O0dBSUc7QUFDSCxtRUFBbUU7QUFFbkU7Ozs7R0FJRztBQUNILG1FQUFtRTtBQUVuRTs7OztHQUlHO0FBQ0gsdUVBQXVFO0FBRXZFOzs7O0dBSUc7QUFDSCxvRUFBb0U7QUFFcEU7Ozs7R0FJRztBQUNILGtFQUFrRTtBQUVsRTs7OztHQUlHO0FBQ0gsMkVBQTJFO0FBRzNFOzs7O0dBSUc7QUFDSCxtRUFBbUU7QUFHbkU7Ozs7R0FJRztBQUNILG1FQUFtRTtBQUduRTs7OztHQUlHO0FBQ0gsdUVBQXVFO0FBR3ZFOzs7O0dBSUc7QUFDSCx5RUFBeUU7QUFHekU7Ozs7R0FJRztBQUNILHdFQUF3RTtBQUd4RTs7OztHQUlHO0FBQ0gsMEVBQTBFO0FBRzFFOzs7O0dBSUc7QUFDSCxnRUFBZ0U7QUFHaEU7Ozs7R0FJRztBQUNILHNFQUFzRTtBQUd0RTs7OztHQUlHO0FBQ0gsdUVBQXVFO0FBR3ZFOzs7O0dBSUc7QUFDSCwwRUFBMEU7QUFFMUU7Ozs7Ozs7Ozs7OztHQVlHO0lBQ0csZ0JBQWdCO0lBQVNBLFVBQXpCQSxnQkFBZ0JBLFVBQXdCQTtJQUk3Q0EsU0FKS0EsZ0JBQWdCQSxDQUlUQSxNQUFrQkE7UUFFN0JDLGlCQUFPQSxDQUFDQTtRQUVSQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQTtJQUN4QkEsQ0FBQ0E7SUFFTUQsMkNBQWdCQSxHQUF2QkEsVUFBd0JBLElBQVdBLEVBQUVBLFFBQWlCQTtRQUVyREUsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxJQUFJQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtJQUNoREEsQ0FBQ0E7SUFHTUYsOENBQW1CQSxHQUExQkEsVUFBMkJBLElBQVdBLEVBQUVBLFFBQWlCQTtRQUV4REcsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsbUJBQW1CQSxDQUFDQSxJQUFJQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtJQUNuREEsQ0FBQ0E7SUFFTUgsMkNBQWdCQSxHQUF2QkEsVUFBd0JBLElBQVdBLEVBQUVBLFFBQXdCQTtRQUF4Qkksd0JBQXdCQSxHQUF4QkEsZUFBd0JBO1FBRTVEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO0lBQ3ZEQSxDQUFDQTtJQVFGSix1QkFBQ0E7QUFBREEsQ0FqQ0EsQUFpQ0NBLEVBakM4QixlQUFlLEVBaUM3QztBQUVELEFBQTBCLGlCQUFqQixnQkFBZ0IsQ0FBQyIsImZpbGUiOiJsaWJyYXJ5L0Fzc2V0TG9hZGVyVG9rZW4uanMiLCJzb3VyY2VSb290IjoiLi4vIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFzc2V0TG9hZGVyXHRcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvbGlicmFyeS9Bc3NldExvYWRlclwiKTtcbmltcG9ydCBFdmVudERpc3BhdGNoZXJcdFx0XHQ9IHJlcXVpcmUoXCJhd2F5anMtY29yZS9saWIvZXZlbnRzL0V2ZW50RGlzcGF0Y2hlclwiKTtcblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW55IGFzc2V0IGZpbmlzaGVzIHBhcnNpbmcuIEFsc28gc2VlIHNwZWNpZmljIGV2ZW50cyBmb3IgZWFjaFxuICogaW5kaXZpZHVhbCBhc3NldCB0eXBlIChtZXNoZXMsIG1hdGVyaWFscyBldCBjLilcbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cImFzc2V0Q29tcGxldGVcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQXNzZXRFdmVudFwiKV1cblxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhIGZ1bGwgcmVzb3VyY2UgKGluY2x1ZGluZyBkZXBlbmRlbmNpZXMpIGZpbmlzaGVzIGxvYWRpbmcuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Mb2FkZXJFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwicmVzb3VyY2VDb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5Mb2FkZXJFdmVudFwiKV1cblxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhIHNpbmdsZSBkZXBlbmRlbmN5ICh3aGljaCBtYXkgYmUgdGhlIG1haW4gZmlsZSBvZiBhIHJlc291cmNlKVxuICogZmluaXNoZXMgbG9hZGluZy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkxvYWRlckV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJkZXBlbmRlbmN5Q29tcGxldGVcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuTG9hZGVyRXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW4gZXJyb3Igb2NjdXJzIGR1cmluZyBsb2FkaW5nLiBJXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Mb2FkZXJFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwibG9hZEVycm9yXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkxvYWRlckV2ZW50XCIpXVxuXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIGFuIGVycm9yIG9jY3VycyBkdXJpbmcgcGFyc2luZy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLlBhcnNlckV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJwYXJzZUVycm9yXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLlBhcnNlckV2ZW50XCIpXVxuXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIGEgc2t5Ym94IGFzc2V0IGhhcyBiZWVuIGNvc3RydWN0ZWQgZnJvbSBhIHJlc3NvdXJjZS5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cInNreWJveENvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIGEgY2FtZXJhM2QgYXNzZXQgaGFzIGJlZW4gY29zdHJ1Y3RlZCBmcm9tIGEgcmVzc291cmNlLlxuICpcbiAqIEBldmVudFR5cGUgYXdheS5ldmVudHMuQXNzZXRFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwiY2FtZXJhQ29tcGxldGVcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQXNzZXRFdmVudFwiKV1cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYSBtZXNoIGFzc2V0IGhhcyBiZWVuIGNvc3RydWN0ZWQgZnJvbSBhIHJlc3NvdXJjZS5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cIm1lc2hDb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5Bc3NldEV2ZW50XCIpXVxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhIGdlb21ldHJ5IGFzc2V0IGhhcyBiZWVuIGNvbnN0cnVjdGVkIGZyb20gYSByZXNvdXJjZS5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cImdlb21ldHJ5Q29tcGxldGVcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQXNzZXRFdmVudFwiKV1cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYSBza2VsZXRvbiBhc3NldCBoYXMgYmVlbiBjb25zdHJ1Y3RlZCBmcm9tIGEgcmVzb3VyY2UuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJza2VsZXRvbkNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIGEgc2tlbGV0b24gcG9zZSBhc3NldCBoYXMgYmVlbiBjb25zdHJ1Y3RlZCBmcm9tIGEgcmVzb3VyY2UuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJza2VsZXRvblBvc2VDb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5Bc3NldEV2ZW50XCIpXVxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhIGNvbnRhaW5lciBhc3NldCBoYXMgYmVlbiBjb25zdHJ1Y3RlZCBmcm9tIGEgcmVzb3VyY2UuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJjb250YWluZXJDb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5Bc3NldEV2ZW50XCIpXVxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhIHRleHR1cmUgYXNzZXQgaGFzIGJlZW4gY29uc3RydWN0ZWQgZnJvbSBhIHJlc291cmNlLlxuICpcbiAqIEBldmVudFR5cGUgYXdheS5ldmVudHMuQXNzZXRFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwidGV4dHVyZUNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIGEgdGV4dHVyZSBwcm9qZWN0b3IgYXNzZXQgaGFzIGJlZW4gY29uc3RydWN0ZWQgZnJvbSBhIHJlc291cmNlLlxuICpcbiAqIEBldmVudFR5cGUgYXdheS5ldmVudHMuQXNzZXRFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwidGV4dHVyZVByb2plY3RvckNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYSBtYXRlcmlhbCBhc3NldCBoYXMgYmVlbiBjb25zdHJ1Y3RlZCBmcm9tIGEgcmVzb3VyY2UuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJtYXRlcmlhbENvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYSBhbmltYXRvciBhc3NldCBoYXMgYmVlbiBjb25zdHJ1Y3RlZCBmcm9tIGEgcmVzb3VyY2UuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJhbmltYXRvckNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW4gYW5pbWF0aW9uIHNldCBoYXMgYmVlbiBjb25zdHJ1Y3RlZCBmcm9tIGEgZ3JvdXAgb2YgYW5pbWF0aW9uIHN0YXRlIHJlc291cmNlcy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cImFuaW1hdGlvblNldENvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW4gYW5pbWF0aW9uIHN0YXRlIGhhcyBiZWVuIGNvbnN0cnVjdGVkIGZyb20gYSBncm91cCBvZiBhbmltYXRpb24gbm9kZSByZXNvdXJjZXMuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJhbmltYXRpb25TdGF0ZUNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW4gYW5pbWF0aW9uIG5vZGUgaGFzIGJlZW4gY29uc3RydWN0ZWQgZnJvbSBhIHJlc291cmNlLlxuICpcbiAqIEBldmVudFR5cGUgYXdheS5ldmVudHMuQXNzZXRFdmVudFxuICovXG4vL1tFdmVudChuYW1lPVwiYW5pbWF0aW9uTm9kZUNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW4gYW5pbWF0aW9uIHN0YXRlIHRyYW5zaXRpb24gaGFzIGJlZW4gY29uc3RydWN0ZWQgZnJvbSBhIGdyb3VwIG9mIGFuaW1hdGlvbiBub2RlIHJlc291cmNlcy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cInN0YXRlVHJhbnNpdGlvbkNvbXBsZXRlXCIsIHR5cGU9XCJhd2F5M2QuZXZlbnRzLkFzc2V0RXZlbnRcIildXG5cblxuLyoqXG4gKiBEaXNwYXRjaGVkIHdoZW4gYW4gbGlnaHQgYXNzZXQgaGFzIGJlZW4gY29uc3RydWN0ZWQgZnJvbSBhIHJlc291cmNlcy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cImxpZ2h0Q29tcGxldGVcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQXNzZXRFdmVudFwiKV1cblxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhbiBsaWdodCBwaWNrZXIgYXNzZXQgaGFzIGJlZW4gY29uc3RydWN0ZWQgZnJvbSBhIHJlc291cmNlcy5cbiAqXG4gKiBAZXZlbnRUeXBlIGF3YXkuZXZlbnRzLkFzc2V0RXZlbnRcbiAqL1xuLy9bRXZlbnQobmFtZT1cImxpZ2h0UGlja2VyQ29tcGxldGVcIiwgdHlwZT1cImF3YXkzZC5ldmVudHMuQXNzZXRFdmVudFwiKV1cblxuXG4vKipcbiAqIERpc3BhdGNoZWQgd2hlbiBhbiBlZmZlY3QgbWV0aG9kIGFzc2V0IGhhcyBiZWVuIGNvbnN0cnVjdGVkIGZyb20gYSByZXNvdXJjZXMuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJlZmZlY3RNZXRob2RDb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5Bc3NldEV2ZW50XCIpXVxuXG5cbi8qKlxuICogRGlzcGF0Y2hlZCB3aGVuIGFuIHNoYWRvdyBtYXAgbWV0aG9kIGFzc2V0IGhhcyBiZWVuIGNvbnN0cnVjdGVkIGZyb20gYSByZXNvdXJjZXMuXG4gKlxuICogQGV2ZW50VHlwZSBhd2F5LmV2ZW50cy5Bc3NldEV2ZW50XG4gKi9cbi8vW0V2ZW50KG5hbWU9XCJzaGFkb3dNYXBNZXRob2RDb21wbGV0ZVwiLCB0eXBlPVwiYXdheTNkLmV2ZW50cy5Bc3NldEV2ZW50XCIpXVxuXG4vKipcbiAqIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzIGFyZSByZXR1cm5lZCBhcyB0b2tlbnMgYnkgbG9hZGluZyBvcGVyYXRpb25zXG4gKiB0byBwcm92aWRlIGFuIG9iamVjdCBvbiB3aGljaCBldmVudHMgY2FuIGJlIGxpc3RlbmVkIGZvciBpbiBjYXNlcyB3aGVyZVxuICogdGhlIGFjdHVhbCBhc3NldCBsb2FkZXIgaXMgbm90IGRpcmVjdGx5IGF2YWlsYWJsZSAoZS5nLiB3aGVuIHVzaW5nIHRoZVxuICogQXNzZXRMaWJyYXJ5IHRvIHBlcmZvcm0gdGhlIGxvYWQuKVxuICpcbiAqIEJ5IGxpc3RlbmluZyBmb3IgZXZlbnRzIG9uIHRoaXMgY2xhc3MgaW5zdGVhZCBvZiBkaXJlY3RseSBvbiB0aGVcbiAqIEFzc2V0TGlicmFyeSwgb25lIGNhbiBkaXN0aW5ndWlzaCBkaWZmZXJlbnQgbG9hZHMgZnJvbSBlYWNoIG90aGVyLlxuICpcbiAqIFRoZSB0b2tlbiB3aWxsIGRpc3BhdGNoIGFsbCBldmVudHMgdGhhdCB0aGUgb3JpZ2luYWwgQXNzZXRMb2FkZXIgZGlzcGF0Y2hlcyxcbiAqIHdoaWxlIG5vdCBwcm92aWRpbmcgYW4gaW50ZXJmYWNlIHRvIG9ic3RydWN0IHRoZSBsb2FkIGFuZCBpcyBhcyBzdWNoIGFcbiAqIHNhZmVyIHJldHVybiB2YWx1ZSBmb3IgbG9hZGVyIHdyYXBwZXJzIHRoYW4gdGhlIGxvYWRlciBpdHNlbGYuXG4gKi9cbmNsYXNzIEFzc2V0TG9hZGVyVG9rZW4gZXh0ZW5kcyBFdmVudERpc3BhdGNoZXJcbntcblx0cHVibGljIF9pTG9hZGVyOkFzc2V0TG9hZGVyO1xuXG5cdGNvbnN0cnVjdG9yKGxvYWRlcjpBc3NldExvYWRlcilcblx0e1xuXHRcdHN1cGVyKCk7XG5cblx0XHR0aGlzLl9pTG9hZGVyID0gbG9hZGVyO1xuXHR9XG5cblx0cHVibGljIGFkZEV2ZW50TGlzdGVuZXIodHlwZTpzdHJpbmcsIGxpc3RlbmVyOkZ1bmN0aW9uKVxuXHR7XG5cdFx0dGhpcy5faUxvYWRlci5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKTtcblx0fVxuXG5cblx0cHVibGljIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZTpzdHJpbmcsIGxpc3RlbmVyOkZ1bmN0aW9uKVxuXHR7XG5cdFx0dGhpcy5faUxvYWRlci5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKTtcblx0fVxuXG5cdHB1YmxpYyBoYXNFdmVudExpc3RlbmVyKHR5cGU6c3RyaW5nLCBsaXN0ZW5lcjpGdW5jdGlvbiA9IG51bGwpOmJvb2xlYW5cblx0e1xuXHRcdHJldHVybiB0aGlzLl9pTG9hZGVyLmhhc0V2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpO1xuXHR9XG5cblx0Lypcblx0IHB1YmxpYyB3aWxsVHJpZ2dlcih0eXBlOnN0cmluZyk6Ym9vbGVhblxuXHQge1xuXHQgcmV0dXJuIHRoaXMuX2lMb2FkZXIud2lsbFRyaWdnZXIodHlwZSk7XG5cdCB9XG5cdCAqL1xufVxuXG5leHBvcnQgPSBBc3NldExvYWRlclRva2VuOyJdfQ==