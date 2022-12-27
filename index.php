<?php

	include 'config.php';
	
	$bras = $_GET['bras'] ? $_GET['bras'] : 1;
	$host = $BRAS[$bras]['ip'];
	$port = $BRAS[$bras]['porta'];
	$user = $BRAS[$bras]['usuario'];
	$pass = $BRAS[$bras]['senha'];

	if($_GET['metodo'] == "int"){
		// Essa função coleta a interface ao qual o usuário está conectado
		$command = '/usr/bin/python /var/www/html/speed_niqturbo/junos.py int '.$_GET['login'].' '.$host.' '.$port.' '.$user.' '.$pass;
		
			$output = shell_exec($command);
			$output = preg_replace('/\\s\\s+/', ' ', $output);
			$output = explode(" ", $output);
			// var_dump($output);
			$user['interface'] = $output[0];
			$user['ipv4'] = $output[1];

			echo json_encode($user);
			exit;
	}
	
	if($_GET['metodo'] == "vel"){
		// Essa função coleta dados de navegação uma vez que já sabemos qual é a interface
		$command = '/usr/bin/python /var/www/html/speed_niqturbo/junos.py vel '.$_GET['interface'].' '.$host.' '.$port.' '.$user.' '.$pass;
		
		$output = shell_exec($command);
		$output = preg_replace('/\\s\\s+/', ' ', $output);
		$output = explode(" ", $output);
		$bps['upload'] = $output[5];
		$bps['download'] = $output[11];

		echo json_encode($bps);
		exit;
	}
	
		
	if(!$_GET['login']){
		
		// retorna nada se não tiver sido passado um login
		// exit;
	}
	
	$login = $_GET['login'];
	// echo '<link rel="shortcut icon" href="favicon.ico" />';
	echo '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">';
	echo '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">';
	echo '<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js"></script>';
	echo '<link rel="stylesheet" href="speed.css">';
 
	// Armazeno os dados temporariamente nestas divs
	echo "<div id='download' login='$login' status='offline' interface='' bras='$bras'></div>";
	echo "<div id='dados' download='0' upload='0'></div>";
	
	echo '
	
	<div class="container">
		<div class="row">
			<div class="col s12">
				<div class="card teal lighten-5">
					<div class="card-content">
	';
	
	echo '			<div class="row">
						<div class="col s6">
							<figure  class="highcharts-figure">
								  <div style="display:none;" id="container"></div>
								  <h4 id="endoflife" class="highcharts-description"> </h4>
							</figure>
						</div>
						<div class="col s6">
							<figure  class="highcharts-figure">
								<div style="display:none;" id="nat"></div>
							</figure>
						</div>
					</div>
	';
	
		
	echo '
	</div>
	</div>
	</div>
	</div>
	';
	

	echo '<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>';
	echo '<script src="https://code.highcharts.com/highcharts.js"></script>';
	echo '<script src="https://code.highcharts.com/modules/exporting.js"></script>';
	echo '<script src="https://code.highcharts.com/modules/export-data.js"></script>';
	echo '<script src="https://code.highcharts.com/modules/accessibility.js"></script>';
	echo '<script src="speed.js?'.time().'"></script>';

?>