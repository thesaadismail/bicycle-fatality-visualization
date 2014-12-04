<?php
	include 'dbinfo.php';
    include 'ChromePhp.php';
	ChromePhp::log('Hello console!');
	//ChromePhp::warn('something went wrong!');
	
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);
	
	$data = $_POST["result"];
	$data   = json_decode("$data",true);
    //just echo an item in the array
	
	$selectedStates = "first";
	$startmonth = 1;//$data['start'];
	$endmonth = 5;//$data['end'];
	for ($x = 1; $x <= 56; $x++) {		//count($data)
		if($data[$x]!=null && $data[$x]==1)
			if($selectedStates=="first")
				$selectedStates = $x;
			else
				$selectedStates = $selectedStates.", ".$x;
	} 
	if($selectedStates=="first")
		$selectedStates = 0;
	
	$myquery="ALTER VIEW current_data 
				AS SELECT statenum, casenum, atmcond,  accdate, accday, acchr, accmin, accmon, acctime , dayofweek, lightcond, nmlocat
				FROM data_all
				WHERE statenum IN (".$selectedStates.") AND accmon BETWEEN ".$startmonth." AND ".$endmonth;
	ChromePhp::log($myquery);
	
	$query = mysql_query($myquery);
			
	if ( ! $query ) {
		echo mysql_error();
		die;
	}
	
	mysql_query($query);
	echo "query result"; 
	
    mysql_close($server);
?>