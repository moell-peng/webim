<?php

namespace WebIM;

class Config implements \ArrayAccess
{
    private $config = [];

    private static $instance;

    private $path;

    private function __construct()
    {
        $this->path = __DIR__."/../config/";
    }

    public static function instance()
    {
        if (!(self::$instance instanceof Config)) {
            self::$instance = new Config();
        }
        return self::$instance;
    }

    public function offsetExists($offset)
    {
        return isset($this->config[$offset]);
    }

    public function offsetGet($offset)
    {
        if (empty($this->config[$offset])) {
            $this->config[$offset] = require $this->path.$offset.".php";
        }
        return $this->config[$offset];
    }

    public function offsetSet($offset, $value)
    {
        throw new \Exception('不提供设置配置');
    }

    public function offsetUnset($offset)
    {
        throw new \Exception('不提供删除配置');
    }

    private function __clone()
    {
        // TODO: Implement __clone() method.
    }
}