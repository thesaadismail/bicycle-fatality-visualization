<?php
	include 'dbinfo.php';
    include 'ChromePhp.php';
	ChromePhp::log('cdm cell click click update');
	//ChromePhp::warn('something went wrong!');
	
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$data = $_POST["result"];
	$data   = json_decode("$data",true);
    //just echo an item in the array
	
	$selectedStates = "first";
	$atm = $data['weather'];
	$location = $data['location'];
	for ($x = 1; $x <= 56; $x++) {		//count($data)
		if($data[$x]!=null && $data[$x]==1)
			if($selectedStates=="first")
				$selectedStates = $x;
			else
				$selectedStates = $selectedStates.", ".$x;
	} 
	if($selectedStates=="first")
		$selectedStates = 0;
	
	$myquery="	ALTER VIEW for_line_graph 
				AS SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
				FROM current_data
				WHERE atmcond = (select atm_cond.id from atm_cond where atm_cond.type='".$atm."') 
				AND nmlocat = (select nm_location.id from nm_location where nm_location.type='".$location."');
			 ";
	//ChromePhp::log($myquery);
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	mysql_query($query);
	echo "query result"; 
	
    mysql_close($server);
?>