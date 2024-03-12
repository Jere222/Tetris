import {
    useEffect,
    useState
} from "react"

const Tablero = () => {
    const [tablero, setTablero] = useState([])
    const [tableroAux, setTableroAux] = useState([])
    const [figura, setFigura] = useState({})
    const [empezar, setEmpezar] = useState(false)
    const [puntuacion, setPuntuacion] = useState(0)
    const [tiempo, setTiempo] = useState(300)
    const [gameOver, setGameOver] = useState(false)

    // Setear una de las figuras aleatoriamente 
    const getFigura = () => {
        let fig = {}
        switch (Math.floor(Math.random() * 7)) {
            case 0:
                fig = {estilo: 'rojo', forma: [0, 10, 11, 21], posiblesFormas: [[0, 10, 11, 21], [11, 12, 20, 21]]}
                break
            case 1:
                fig = {estilo: 'lila', forma: [10, 11, 12, 21], posiblesFormas: [[10, 11, 12, 21], [1, 11, 12, 21], [11, 20, 21, 22], [1, 10, 11, 21,]]}
                break
            case 2:
                fig = {estilo: 'amarillo', forma: [0, 1, 10, 11]}
                break
            case 3:
                fig = {estilo: 'naranja', forma: [1, 10, 11, 20], posiblesFormas: [[1, 10, 11, 20], [10, 11, 21, 22]]}
                break
            case 4:
                fig = {estilo: 'celeste', forma: [0, 10, 20, 30], posiblesFormas: [[0, 10, 20, 30], [30, 31, 32, 33]]}
                break
            case 5:
                fig = {estilo: 'azul', forma: [1, 11, 20, 21], posiblesFormas: [[1, 11, 20, 21], [10, 20, 21, 22], [0, 1, 10, 20], [10, 11, 12, 22]]}
                break
            case 6:
                fig = {estilo: 'verde', forma: [0, 10, 20, 21], posiblesFormas: [[0, 10, 20, 21], [10, 11, 12, 20], [0, 1, 11, 21], [12, 20, 21, 22]]}
                break
        }
        fig.formaActual = 0
        fig.forma.forEach((pos,i)=> fig.forma[i]= pos+4)
        setFigura(fig)
    }
    
    const getTablero = () => {
        let cuadrados = [...tableroAux]
        if (!cuadrados.length) {
            for (let i = 0; i < 230; i++) cuadrados.push("vacio")
            setTableroAux(cuadrados)
        }
        figura.estilo && figura.forma.forEach(pos => cuadrados[pos] = figura.estilo)
        setTablero(cuadrados)
    }

    const moverY = () => {
        if (figura.estilo) {
            const fig = {...figura}
            let band = true
            fig.forma.forEach(pos => ((pos >= 220) || (tableroAux[pos+10]!='vacio')) && (band = false))
            if (band) {
                fig.forma.forEach((pos, i) => fig.forma[i] = pos + 10)
                setFigura(fig)
            } else {
                let cuadrados = [...tablero]
                if(cuadrados.length){
                    let co = 0
                    for (let i = 0; i < (cuadrados.length/10); i++) {
                        if(cuadrados.filter((cuadrado, j) => (j>=(i*10))&&(j<=(i*10+9)&&(cuadrado!="vacio"))).length==10){
                            cuadrados = cuadrados.filter((cuadrado, j) => (j<(i*10))||(j>(i*10+9)))
                            for (let i = 0; i < 10; i++) {
                                cuadrados.unshift("vacio")
                            }
                            co++
                        }
                    }
                    co&&setPuntuacion(puntuacion+co*100)
                }
                setTableroAux(cuadrados)
                fig.forma.forEach(pos => (pos<20)&&(band=true))
                if(!band)getFigura()
                else setGameOver(true)
            }
        } else getFigura()
    }
    
    const moverX = (masMenos) => {
        if(figura.estilo) {
            const fig = {...figura}
            const limite = masMenos? 9 : 0
            const sumando = masMenos? 1 : -1
            let band = true
            fig.forma.forEach(pos => (((pos%10) == limite) || (tableroAux[pos+sumando]!='vacio'))&&(band=false))
            if(band){
                fig.forma.forEach((pos, i) => fig.forma[i] = pos + sumando)
                setFigura(fig)
            }
        }
    }

    const cambiarForma = () => {
        let band = true
        const fActual = figura.formaActual 
        const fSig = (figura.formaActual==(figura.posiblesFormas.length-1)? 0 : figura.formaActual+1)
        figura.posiblesFormas[fSig].forEach((pos,i)=> ((((figura.forma[i]%10-figura.posiblesFormas[fActual][i]%10+pos%10)>9)||((figura.forma[i]%10-figura.posiblesFormas[fActual][i]%10+pos%10)<0)||(tableroAux[figura.forma[i]-figura.posiblesFormas[fActual][i]+pos]!='vacio')))&&(band=false))
        if(figura.posiblesFormas&&band){
            const fig = {...figura}
            fig.forma.forEach((pos, i) => fig.forma[i]= pos - fig.posiblesFormas[fig.formaActual][i])
            fig.formaActual = fSig
            fig.forma.forEach((pos, i) => fig.forma[i]= pos + fig.posiblesFormas[fig.formaActual][i])
            setFigura(fig)
        }
    }

    const presionarTecla = (e) => {
        if(e.key=="ArrowDown") empezar&&moverY()
        else if(e.key=="ArrowLeft") moverX(false)
        else if(e.key=="ArrowRight") moverX(true)
        else if(e.key=="ArrowUp") cambiarForma()
        getTablero() 
    }


    useEffect(() => {
        let t
        if(empezar) {
            t = setTimeout(()=> {moverY(), getTablero()}, tiempo) 
        }
        else getTablero()
        tiempo>50&&setTiempo(300-puntuacion*0.03)
        return () => clearTimeout(t)
    }, [figura, empezar])

    return (
        <div className='contenedorTablero' onKeyDown={presionarTecla} tabIndex={0}>
            <div className='tablero'  >
                {tablero.filter((cuadrado, i) => i>9).map((cuadrado, index) => <div key={index} className={`cuadrado ${cuadrado}`}></div>)}
            </div>
            <h4 className="puntuacion">{puntuacion}</h4>
            <div className="btns">    
                <div className="btnsSR">
                    <button onClick={()=> setEmpezar(true)}>Start</button>
                    <button onClick={()=> {setTablero([]), setTableroAux([]), setFigura({}), setEmpezar(false), setPuntuacion(0), setTiempo(500), setGameOver(false)}}>Reset</button>
                </div>
                <div className="btnsCelu">
                    <div>
                        <button id='izq' onClick={() => {moverX(false), getTablero()}}>←</button>
                        <button id='cambio' onClick={()=> {cambiarForma(), getTablero()}}>cambio</button>
                    </div>
                    <div>
                        <button id='abajo' onClick={() => {empezar&&(moverY(), getTablero())}}>↓</button>
                        <button id='der' onClick={() => {moverX(true), getTablero()}}>→</button>
                    </div>
                </div>
            </div>
            {gameOver&&<p className="gameOver">GameOver</p>}
        </div>
    )
}

export default Tablero