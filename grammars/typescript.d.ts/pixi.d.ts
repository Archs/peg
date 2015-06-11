declare module PIXI {

    //https://github.com/primus/eventemitter3
    export class EventEmitter {

        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
        on(event: string, fn: Function, context?: any): EventEmitter;
        once(event: string, fn: Function, context?: any): EventEmitter;
        removeListener(event: string, fn: Function, once?: boolean): EventEmitter;
        removeAllListeners(event: string): EventEmitter;

        off(event: string, fn: Function, once?: boolean): EventEmitter;
        addListener(event: string, fn: Function, context?: any): EventEmitter;

    }

    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////CORE//////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    //display

    export class DisplayObject extends EventEmitter implements interaction.InteractiveTarget {

        //begin extras.cacheAsBitmap
        private _cacheAsBitmap: boolean;
        private _originalUpdateTransform: boolean;
        private _originalHitTest: any;
        private _cachedSprite: any;
        private _originalDestroy: any;

        cacheAsBitmap: boolean;

        private _getCachedBounds(): Rectangle;
        private _destroyCachedDisplayObject(): void;
        private _cacheAsBitmapDestroy(): void;
        //end extras.cacheAsBitmap

        private _sr: number;
        private _cr: number;
        private _bounds: Rectangle;
        private _currentBounds: Rectangle;
        private _mask: Rectangle;
        private _cachedObject: any;

        updateTransform(): void;

        position: Point;
        scale: Point;
        pivot: Point;
        rotation: number;
        renderable: boolean;
        alpha: number;
        visible: boolean;
        parent: Container;
        worldAlpha: number;
        worldTransform: Matrix;
        filterArea: Rectangle;

        x: number;
        y: number;
        worldVisible: boolean;
        name: string;


        getBounds(matrix?: Matrix): Rectangle;
        getLocalBounds(): Rectangle;
        toGlobal(position: Point): Point;
        toLocal(position: Point, from?: DisplayObject): Point;
        destroy(): void;
        getChildByName(name: string): DisplayObject;
        getGlobalPosition(point: Point): Point;

        interactive: boolean;
        buttonMode: boolean;
        interactiveChildren: boolean;
        defaultCursor: string;

        on(event: string, fn: (event: interaction.InteractionEvent) => void, context?: any): EventEmitter;

        once(event: string, fn: (event: interaction.InteractionEvent) => void, context?: any): EventEmitter;

    }

    export class Container extends DisplayObject {

        children: DisplayObject[];

        width: number;
        height: number;

        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        swapChildren(child: DisplayObject, child2: DisplayObject): void;
        getChildIndex(child: DisplayObject): number;
        setChildIndex(child: DisplayObject, index: number): void;
        getChildAt(index: number): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        removeChildren(beginIndex?: number, endIndex?: number): DisplayObject[];
        destroy(destroyChildren?: boolean): void;


    }
    //////////////////////////////////////////////////////////////////////////////
    ////////////////////////////INTERACTION///////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    export module interaction {
        export interface InteractionEvent {

            stopped: boolean;
            target: any;
            type: string;
            data: InteractionData;
            stopPropagation(): void;

        }

        export class InteractionData {

            global: Point;
            target: DisplayObject;
            originalEvent: Event;

            getLocalPosition(displayObject: DisplayObject, point?: Point, globalPos?: Point): Point;

        }

        export class InteractionManager {

            private interactionDOMElement: HTMLElement;
            private eventsAdded: boolean;
            private _tempPoint: Point;

            private setTargetElement(element: HTMLElement, resolution: number): void;
            private addEvents(): void;
            private removeEvents(): void;
            private dispatchEvent(displayObject: DisplayObject, eventString: string, eventData: any): void;
            private onMouseDown: (event: Event) => void;
            private processMouseDown: (displayObject: DisplayObject, hit: boolean) => void;
            private onMouseUp: (event: Event) => void;
            private processMouseUp: (displayObject: DisplayObject, hit: boolean) => void;
            private onMouseMove: (event: Event) => void;
            private processMouseMove: (displayObject: DisplayObject, hit: boolean) => void;
            private onMouseOut: (event: Event) => void;
            private processMouseOverOut: (displayObject: DisplayObject, hit: boolean) => void;
            private onTouchStart: (event: Event) => void;
            private processTouchStart: (DisplayObject: DisplayObject, hit: boolean) => void;
            private onTouchEnd: (event: Event) => void;
            private processTouchEnd: (displayObject: DisplayObject, hit: boolean) => void;
            private onTouchMove: (event: Event) => void;
            private processTouchMove: (displayObject: DisplayObject, hit: boolean) => void;
            private getTouchData(touchEvent: InteractionData): InteractionData;
            private returnTouchData(touchData: InteractionData): void;

            autoPreventDefault: boolean;
            interactionFrequency: number;
            mouse: InteractionData;
            eventData: {
                stopped: boolean;
                target: any;
                type: any;
                data: InteractionData;
            };
            interactiveDataPool: InteractionData[];
            last: number;
            currentCursorStyle: string;
            resolution: number;
            update(deltaTime: number): void;

            mapPositionToPoint(point: Point, x: number, y: number): void;
            processInteractive(point: Point, displayObject: DisplayObject, func: (displayObject: DisplayObject, hit: boolean) => void, hitTest: boolean, interactive: boolean): boolean;
            destroy(): void;

        }

        export interface InteractiveTarget {

            interactive: boolean;
            buttonMode: boolean;
            interactiveChildren: boolean;
            defaultCursor: string;

        }

    }

    //math

    export class Point {

        x: number;
        y: number;

        constructor(x?: number, y?: number);

        clone(): Point;
        copy(p: Point): void;
        equals(p: Point): boolean;
        set(x?: number, y?: number): void;

    }
    export class Matrix {

        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;

        fromArray(array: number[]): void;
        toArray(transpose?: boolean, out?: number[]): number[];
        apply(pos: Point, newPos?: Point): Point;
        applyInverse(pos: Point, newPos?: Point): Point;
        translate(x: number, y: number): Matrix;
        scale(x: number, y: number): Matrix;
        rotate(angle: number): Matrix;
        append(matrix: Matrix): Matrix;
        prepend(matrix: Matrix): Matrix;
        invert(): Matrix;
        identity(): Matrix;
        clone(): Matrix;
        copy(matrix: Matrix): Matrix;

        static IDENTITY: Matrix;
        static TEMP_MATRIX: Matrix;

    }
    export class Circle {

        constructor(x?: number, y?: number, radius?: number);

        x: number;
        y: number;
        radius: number;
        type: number;

        clone(): Circle;
        contains(x: number, y: number): boolean;
        getBounds(): Rectangle;

    }
    export class Ellipse {

        constructor(x?: number, y?: number, width?: number, height?: number);

        x: number;
        y: number;
        width: number;
        height: number;
        type: number;

        clone(): Ellipse;
        contains(x: number, y: number): boolean;
        getBounds(): Rectangle;

    }
    export class Polygon {

        constructor(points: Point[]);
        constructor(points: number[]);
        constructor(...points: Point[]);
        constructor(...points: number[]);

        closed: boolean;
        points: number[];
        type: number;

        clone(): Polygon;
        contains(x: number, y: number): boolean;


    }
    export class Rectangle {

        constructor(x?: number, y?: number, width?: number, height?: number);

        x: number;
        y: number;
        width: number;
        height: number;
        type: number;

        static EMPTY: Rectangle;

        clone(): Rectangle;
        contains(x: number, y: number): boolean;

    }
    export class RoundedRectangle {

        constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);

        x: number;
        y: number;
        width: number;
        height: number;
        radius: number;
        type: number;

        static EMPTY: Rectangle;

        clone(): Rectangle;
        contains(x: number, y: number): boolean;

    }

}
