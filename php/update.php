<?php
    $username = "root"; 
    $password = "";   
    $host = "localhost";
    $database="iv";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$data = $_POST["result"];
	$data   = json_decode("$data",true);
    //just echo an item in the array
	
	$selectedStates = "first";
	
	for ($x = 1; $x <= 56; $x++) {		//count($data)
		if($data[$x]!=null && $data[$x]==1)
			if($selectedStates=="first")
				$selectedStates = $x;
			else
				$selectedStates = $selectedStates.", ".$x;
	} 
	echo "V: ".$selectedStates.", ";
	
	$myquery="ALTER VIEW current_data 
				AS SELECT statenum, casenum, atmcond, 'crash day', 'crash hr', 'crash min', 'crash mon', 'crash time', 'caseyear', lightcond, nmlocat FROM data_all
				WHERE statenum IN (".$selectedStates.");";
			echo "br />".$myquery;
	/* 
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	mysql_query($query);
	echo "query result"; */
	
    mysql_close($server);
?>