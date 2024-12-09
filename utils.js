const path = require('path')
const nodeDiskInfo = require('node-disk-info')
const ChartJsImage = require('chartjs-to-image');

//extraer informacion de discos del server 
const discos = async()=> nodeDiskInfo.getDiskInfo()
                    .then(disks => {
                      console.log('ASYNC WAY', disks);
                      let discos = disks
                                    .filter(item=> item._blocks !== 0 )
                                    .map(item=>{
                                      return {
                                        disco: 'Disco '+item._mounted, 
                                        usado: Math.round((item._used / item._blocks) * 100) || 10, 
                                        disponible: Math.round((item._available / item._blocks)*100) || 10 
                                      }
                                    })
                                    .sort((a, b) => a.disponible - b.disponible)
                                    .filter(item=> item.disponible <=50 )
                      console.log(discos)
                      return discos 
                      //if (discos.filter(item=> item.disponible < 15 ).length > 0 ) console.log('existen discos criticos')
                      //saveImage(discos)            
                    })
                    .catch(reason => {
                        return []
                        console.error(reason);
                    })

//para crear la imagen de graficos para discos ... 
const saveImage = async(data)=>{
  let dataUsados = data.map(item=> item.usado)
  let dataDisponible = data.map(item=> item.disponible)
  let discos = data.map(item=> item.disco )
  const myChart2 = new ChartJsImage();
  myChart2.setConfig({
    type: 'bar',
    data: {
      labels: discos,  
      datasets: [
        {
          label: 'DISPONIBLES',
          backgroundColor: '#ff1748',
          data: dataDisponible  
        },
        {
          label: 'USADOS',
          backgroundColor: '#36a2eb',
          data: dataUsados 
        },
      ],
    },
    options: {
      responsive:true,
      title: {
        display: true,
        text: 'ESPACIO EN DISCOS',
      },
      plugins: {
        datalabels: {
          anchor: 'center',
          align: 'center',
          color: '#fff',
          font: {
            weight: 'bold',
          },
          formatter: (val)=>{ return val + '%'}
        },
      },
      scales: {
        xAxes: [
          {
            stacked: true,
          },
        ],
        yAxes: [
          {
            stacked: true,
          },
        ],
      },      
    },
  })
  .setWidth(600)
  .setHeight(400)

	Promise.all( [ myChart2.toFile( path.join(__dirname, 'public/charts', 'mychart2.png')) ])
	.then(async(x)=>{
        console.log('imagen creada!')
        return 'ok'
        // await axios.get('http://192.168.10.80:5002/enviar/981302793/prueba')
		// .then(function (response) {
		// 	// handle success
		// 	console.log('mensaje enviado al grupo');
		// })
		// .catch(function (error) {
		// 	// handle error
		// 	console.log(error);
		// })
    })
    .catch(error =>{
        console.log('error al crear imagen !! ', error)
        return 'error'
    })
}

module.exports = {discos , saveImage}
