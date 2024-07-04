import * as THREE from 'three'

export default class PathConstructor{

    private _isAllowed = true;

    private _scene: THREE.Scene;
    private _lineStart: THREE.Vector3;
    private _lineEnd: THREE.Vector3;

    private _points= new Array<THREE.Vector3>;
    private _isConstructingLine = true;
    private _isFirstLine = true;

    private _tempLine: THREE.Line;

    private _finalLine: THREE.Line;

    private _curveToSimulate: THREE.Line;

    public constructor(scene: THREE.Scene){
        this._scene = scene

        const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const points = [new THREE.Vector3(),new THREE.Vector3()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this._tempLine = new THREE.Line(geometry, material);

        const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
        this._finalLine = new THREE.Line(geometry, material);

        this._scene.add(this._tempLine);
        this._scene.add(this._finalLine);
    }

    public processClickEvent(pointOfClick: THREE.Vector3){
        if(this._isAllowed){
            if(this._isConstructingLine){
                console.log("line startd")
                if(this._isFirstLine){
                    this._lineStart = pointOfClick;
                    this._isFirstLine = false;
                }  
                this._points.push(pointOfClick);
                this._isConstructingLine = false;
                
            }else{
                this._isConstructingLine = true; 
                this._lineStart = pointOfClick;
                this._points.push(pointOfClick);
                this._finalLine.geometry = new THREE.BufferGeometry().setFromPoints(this._points);
            }   
        }
    }

    public processMouseMove(tempEndPoint: THREE.Vector3 ){
        if(tempEndPoint != undefined)
            if(this._isConstructingLine)
                this._tempLine.geometry = new THREE.BufferGeometry().setFromPoints([this._lineStart, tempEndPoint]);
    }

    public getCurveToSimulate(): THREE.Line{
        return this._curveToSimulate;
    }

    public constructCurve(){
        const path = new THREE.CatmullRomCurve3(this._points);
        const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(100));
        const pathMaterial = new THREE.LineBasicMaterial({color:0xff0000});
        const pathObject = new THREE.Line(pathGeometry);

        this._isAllowed = false;

        this._scene.remove(this._finalLine);
        this._scene.remove(this._tempLine);
        this._scene.add(pathObject);
    }

    public getNumberOfPoints():number{
       return this._points.length;
    }
}