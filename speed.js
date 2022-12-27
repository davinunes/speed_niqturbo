var repetir = 75;
var encerrar = 0;
var respawn = 2000;
var Download = new Array();
var Upload = new Array();
var Hora = new Array();
var statusOnu = "";
var Resultado = "";

$(document).ready(function(){
		
	$("#endoflife").html("Buscando usuário no roteador...");
	var contar = setInterval(function(){
		if($("#download").attr("status") == "offline"){
			console.log("Estado Offline com: "+encerrar);
			iface();
		}else{
			console.log("Estado Online com: "+encerrar);
			$("#endoflife").html("Monitorando uso de banda...");
			bps();
			nat();
			$("#nat").show();
			$("#container").show();
			
		}
		encerrar++;
		if(encerrar > repetir){
			clearInterval(contar);
			console.log("End of Life com: "+encerrar);
			// console.log("Download:"+Download);
			// console.log("Upload:"+Upload);
			// console.log("Inicio:"+Hora[0]);
			setTimeout(function(){
				$("#endoflife").html("Monitoramento encerrado!");
				$(".natsnap").show();
				var uid = $("#download").attr("login")+'_'+Hora[0];
				// Download, Upload, Inicio, Intervalo, Id, Titulo
				Resultado = exportaGrafico(Download,Upload,Hora[0],respawn,uid,'Trafego observado de '+$("#download").attr("login")+' por '+respawn/1000*repetir+' seg');
				Resultado = Resultado.replace(/'/g,"\\'");
				console.log(Resultado);
				$("#savetest").show();
				
			},respawn);
		}
	},respawn);	

});

function iface() {
	let login = $("#download").attr("login");
	let bras = $("#download").attr("bras");
	var url = 'speed.php?metodo=int&login='+login+'&bras='+bras;
	// console.log("iface: "+url);
    
    $.post(url, "", function(data) {
       var dados = JSON.parse(data);
        console.log(dados);
		console.log(dados.interface);
		if(dados.ipv4 == null){
			$("#download").attr({status:"offline"});
		}else{
			$("#download").attr({status:"online"});
			$("#download").attr({interface:dados.interface});
			$("#download").attr({ipv4:dados.ipv4});
		}
    });
}

function bps() {
	let interface = $("#download").attr("interface");
	let bras = $("#download").attr("bras");
	var url = 'speed.php?metodo=vel&interface='+interface+'&bras='+bras;
		$.post(url, "", function(data) {
		   var dados = JSON.parse(data);
			console.log(dados.download);
			$("#dados").attr({download:dados.download});
			console.log(dados.upload);
			$("#dados").attr({upload:dados.upload});
			if(dados.download == null){
				$("#download").attr({status:"offline"});
			}
		});
		
}

function exportaGrafico(Download, Upload, Inicio, Intervalo, Id, Titulo){
	var retorno = "<div id='"+Id+"'></div>	\n";
	retorno += "<script>	\n";
	retorno += "\t $('#"+Id+"').highcharts({	\n";
	retorno += "\t \t chart: { type: 'spline' },	\n";
	retorno += "\t \t title: { text: '"+Titulo+"' },	\n";
	retorno += "\t \t xAxis: { type: 'datetime', tickPixelInterval: 50 },	\n";
	retorno += "\t \t yAxis: { title: { text: 'bps' } },	\n";
	retorno += "\t \t time: { useUTC: false },	\n";
	retorno += "\t \t legend: { enabled: false },	\n";
	retorno += "\t \t credits: { enabled: false },	\n";
	retorno += "\t \t tooltip: { shared: true }, exporting: { enabled: false },	\n";
	retorno += "\t \t series: [{ name: 'Download',	\n";
	retorno += "\t \t \t data: ["+Download+"],	\n";
	retorno += "\t \t \t pointStart: "+Inicio+",	\n";
	retorno += "\t \t \t pointInterval: "+Intervalo+"	\n";
	retorno += "\t \t \t },{name: 'Upload',	\n";
	retorno += "\t \t \t data: ["+Upload+"],	\n";
	retorno += "\t \t \t pointStart: "+Inicio+",	\n";
	retorno += "\t \t \t pointInterval: "+Intervalo+"	\n";
	retorno += "\t \t \t }]	\n";
	retorno += "\t \t });	\n";
	retorno += "</script>	\n";
	
	
	return(retorno);
}

Highcharts.chart('container', {
  chart: {
    type: 'spline',
    animation: Highcharts.svg, // don't animate in old IE
    marginRight: 10,
    events: {
      load: function () {
		console.log("Repetir vale: "+repetir);
        // set up the updating of the chart each second
        var series0 = this.series[0];
        var series1 = this.series[1];
        var ddd = setInterval(function () {
          var x = (new Date()).getTime(), // current time
            y = parseInt($("#dados").attr("download"));
			Download.push(y);
			Hora.push(x);
          series0.addPoint([x, y], true, true);
		  if(encerrar > repetir){
			  clearInterval(ddd);
		  }
        }, respawn);
        var uuu = setInterval(function () {
          var x = (new Date()).getTime(), // current time
            y = parseInt($("#dados").attr("upload"));
			Upload.push(y);
          series1.addPoint([x, y], true, true);
		  if(encerrar > repetir){
			  clearInterval(uuu);
		  }
        }, respawn);

      }
    }
  },

  time: {
    useUTC: false
  },

  title: {
    text: 'Observando consumo de '+$("#download").attr("login")+' por '+respawn/1000*repetir+' seg'
  },

  accessibility: {
    announceNewData: {
      enabled: false,
      minAnnounceInterval: 15000,
      announcementFormatter: function (allSeries, newSeries, newPoint) {
        if (newPoint) {
          return 'New point added. Value: ' + newPoint.y;
        }
        return false;
      }
    }
  },

  xAxis: {
    type: 'datetime',
    tickPixelInterval: 150
  },

  yAxis: {
    title: {
      text: 'bps'
    },
    plotLines: [{
      value: 0,
      width: 1,
      color: '#808080'
    }]
  },

  tooltip: {
    headerFormat: '<b>{series.name}</b><br/>',
    pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
  },

  legend: {
    enabled: true
  },

  exporting: {
    enabled: false
  },

  series: [{
    name: 'Download',
    data: (function () {
      // generate an array of random data
      var data = [],
        time = (new Date()).getTime(),
        i;

      for (i = -(repetir-2); i <= 0; i += 1) {
        data.push({
          x: time + i * 1000,
          y: 0
        });
      }
      return data;
    }())
  },{
    name: 'Upload',
    data: (function () {
      // generate an array of random data
      var data = [],
        time = (new Date()).getTime(),
        i;

      for (i = -(repetir-2); i <= 0; i += 1) {
        data.push({
          x: time + i * 1000,
          y: 0
        });
      }
	  // var d = JSON.parse(data);
	  // console.log("Eixo Upload:"+d);
      return data;
	  
    }())
  }]
  
});