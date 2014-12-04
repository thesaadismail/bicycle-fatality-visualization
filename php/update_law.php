<?php
	include 'dbinfo.php';
    include 'ChromePhp.php';
	//ChromePhp::warn('something went wrong!');
	
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$data = $_POST["result"];
	$data   = json_decode("$data",true);
    //just echo an item in the array
	
	$selectedStates = "first";
	$startmonth = $data['start'];
	$endmonth = $data['end'];
	$lawtype = $data['allowed'];
	$lawmode = $data['law'];
	
	for ($x = 1; $x <= 56; $x++) {		//count($data)
		if($data[$x]!=null && $data[$x]==1)
			if($selectedStates=="first")
				$selectedStates = $x;
			else
				$selectedStates = $selectedStates.", ".$x;
	} 
	if($selectedStates=="first")
		$selectedStates = 0;
	ChromePhp::log('update_law after forloop');
	
	if($lawmode == 1){
		$myquery="ALTER VIEW current_data 
				AS SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
				FROM data_all, state
				WHERE state.allowed=".$lawtype." 
				AND state.id = data_all.statenum
				AND statenum IN (".$selectedStates.") AND accmon BETWEEN ".$startmonth." AND ".$endmonth;
	}else
		if($lawmode == 0){
			$myquery="ALTER VIEW current_data 
				AS SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
				FROM data_all
				WHERE statenum IN (".$selectedStates.") AND accmon BETWEEN ".$startmonth." AND ".$endmonth;
		}
	
	ChromePhp::log($myquery);
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	mysql_query($query);
	ChromePhp::log('end of update_law php file');
	
    mysql_close($server);
	ChromePhp::log('end of update_law php file...server closed');
?>