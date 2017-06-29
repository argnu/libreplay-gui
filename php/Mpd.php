<?php

namespace Liberascio;

error_reporting(-1);

function formatResponse($res) {
	if (isset($res['errno'])) return array("error" => true, "code" => $res['errno'], "msg" => $res['errmsg']);

	$object = array();
	$elems = preg_split("/\n/", $res['data']);
	foreach ($elems as $elem) {
		if (preg_match('/^(.+):\s*(.*)$/', trim($elem), $matches)) {
			$object[$matches[1]] = $matches[2];
		}
	}
	return array("msg" => $res['result'], "result" => $object);
}

class Mpd {
	private $fp;
	private $version;

	function __construct($host, $port) {
		$errstr = 'Connected to MPD';
		$this->fp = fsockopen( $host, $port, $errno, $errstr, 10 );

		if(! is_resource( $this->fp )) {
			die("{$errstr} ({$errno})<br>");
		}

		// Get version
		while(!feof($this->fp)) {
			$line = fgets($this->fp);
			if (preg_match('/^OK\s*(.*)$/', trim($line), $matches)) {
				$this->version = $matches[1];
				break;
			}
		}
	}

	function disconnect() {
		fclose($this->fp);
	}

	function query($command) {
		$response = array('data'=>'');
		fwrite($this->fp, trim($command)."\n");

		while(!feof($this->fp))
		{
			$line = fgets($this->fp);
			if (preg_match('/^OK\s*(.*)$/', trim($line), $matches)) {
				$response['result'] = 'OK';
				break;
			} else if (preg_match('/^ACK\s+\[(\d+)\@(\d+)\]\s+\{(.*?)\}\s+(.*)$/', trim($line), $matches)) {
				$response['result'] = 'ACK';
				$response['errno'] = $matches[1];
				$response['errmsg'] = $matches[4];
				break;
			} else {
				$response['data'] .= trim($line) . "\n";
			}
		}
		return $response;
	}

  public function getVersion() {
    return $this->version;
  }

	public function doQuery($query) {
		$res = $this->query($query);
		return formatResponse($res);
	}
}
