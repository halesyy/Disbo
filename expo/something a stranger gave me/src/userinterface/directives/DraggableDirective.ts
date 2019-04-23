import Vue from 'vue';
// @ts-ignore
import * as $ from "jquery";

export default class DraggableDirective {

    public static Register() {  

        let isDragging = false;
        let mouseDown = false;
        let currentlyDragging: any;

        let onMouseDown = function(el: any) {
            currentlyDragging = el;
            mouseDown = true;
        }

        let onMouseUp = function(el: any) {
            isDragging = false;
            mouseDown = false;
        }

        let onMouseMove = function(el: any, event: any) {

            if(!mouseDown)
                return;

            if(!isDragging) {
                isDragging = true;
                return;
            }
            

            let container = $('#' + currentlyDragging.dataset.ref);
            let handle = $(currentlyDragging);

            container.css("margin-left", el.clientX - (<number>handle.width()) / 2);
            container.css("margin-top", el.clientY - (<number>handle.height()) / 2);

        }

        document.addEventListener('mousemove', onMouseMove.bind(this));

        Vue.directive('draggable', {
            
            bind: function (el: any) {
                el.addEventListener('mousedown', onMouseDown.bind(null, el));
                document.addEventListener('mouseup', onMouseUp.bind(el));
            }
          })

    }

}