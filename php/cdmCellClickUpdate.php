<?php
	include 'dbinfo.php';
    include 'ChromePhp.php';
	$server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$data = $_POST["result"];
	$data   = json_decode("$data",true);
    //just echo an item in the array
	
	$selectedStates = "first";
	$atm = $data['weather'];
	$location = $data['location'];
	$startmonth = $data['buttonstatus']['start'];
	$endmonth = $data['buttonstatus']['end'];
	
	$weekdays = $data['buttonstatus']['weekdays'];
	$weekends = $data['buttonstatus']['weekends'];
	
	$days = " AND dayofweek BETWEEN 1 and 7";
	if($weekdays == 1 && $weekends == 0) $days = " AND dayofweek in (2,3,4,5,6)";
	if($weekdays == 0 && $weekends == 1) $days = " AND dayofweek in (1,7)"; 
	
	$weatherclause = "";
	if($atm != '' && $atm != null) $weatherclause = "atmcond = (select atm_cond.id from atm_cond where atm_cond.type='".$atm."') AND ";
	else $weatherclause = "";
	
	$locationclause = "";
	if($location != '' && $location != null) $locationclause = "nmlocat = (select nm_location.id from nm_location where nm_location.type='".$location."') AND ";
	else $locationclause = "";
	
	//ChromePhp::log($weatherclause.$locationclause);
	
	for ($x = 1; $x <= 56; $x++) {		//count($data)
		if($data['buttonstatus'][$x]!=null && $data['buttonstatus'][$x]==1)
			if($selectedStates=="first")
				$selectedStates = $x;
			else
				$selectedStates = $selectedStates.", ".$x;
	} 
	if($selectedStates=="first")
		$selectedStates = 0;
	
	
	$myquery="	ALTER VIEW for_line_graph  
				AS SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
				FROM data_all
				WHERE ".$weatherclause . $locationclause . " statenum IN (".$selectedStates.") AND  ptype IN (6,7) AND accmon BETWEEN ".$startmonth." AND ".$endmonth.$days;
	
	/* $myquery1="	ALTER VIEW for_line_graph  
				AS SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
				FROM data_all
				WHERE atmcond = (select atm_cond.id from atm_cond where atm_cond.type='".$atm."') 
				AND nmlocat = (select nm_location.id from nm_location where nm_location.type='".$location."')
				AND statenum IN (".$selectedStates.") AND accmon BETWEEN ".$startmonth." AND ".$endmonth;
	*/
	ChromePhp::log("QUERY for cdmCellClickUpdate =>"); 
	ChromePhp::log($myquery);
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	mysql_query($query);
	
    mysql_close($server);
	
?>