<?php
	/* include $_SERVER['DOCUMENT_ROOT'].'/php/ChromePhp.php';
	ChromePhp::log('Hello console!');
	ChromePhp::warn('something went wrong!'); */
	    
	include 'dbinfo.php';

    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$data = $_POST["result"];
	$data   = json_decode("$data",true);
    //just echo an item in the array
	
	$atm = $data['weather'];
	$location = $data['location'];
	$start = $data['buttonstatus']['start'];
	$end = $data['buttonstatus']['end'];
	
	
	$myquery="
			SELECT acchr HOUR , count( casenum ) fatalities
			FROM data_all
			WHERE accmon BETWEEN ".$start." AND ".$end."
			AND atmcond =(select id from atm_cond where type = '".$atm."')
			AND nmlocat =(select id from nm_location where type = '".$location."')
			GROUP BY HOUR 	
		";
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	$data = array();
	
	for ($x = 0; $x < mysql_num_rows($query); $x++) {
		$data[] = mysql_fetch_assoc($query);
	}
	
	echo json_encode($data);		
	
    mysql_close($server);
?>	