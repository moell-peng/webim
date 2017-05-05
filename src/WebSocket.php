<?php

namespace WebIM;

use Swoole\WebSocket\Server;

class WebSocket
{
    private $server;

    private $table;

    protected $config;

    public function __construct()
    {
        $this->createTable();
        $this->config = Config::instance();
    }

    /**
     * 启动
     */
    public function run()
    {
        $this->server = new Server($this->config['webim']['ip'], $this->config['webim']['port']);

        $this->server->on('open', [$this, 'open']);
        $this->server->on('message', [$this, 'message']);
        $this->server->on('close', [$this, 'close']);

        $this->server->start();
    }

    /**
     * @param Server $server
     * @param $request
     */
    public function open(Server $server, $request)
    {
        $user = [
            'fd' => $request->fd,
            'name' => $this->config['webim']['name'][array_rand($this->config['webim']['name'])].$request->fd,
            'avatar' => $this->config['webim']['avatar'][array_rand($this->config['webim']['avatar'])]
        ];
        $this->table->set($request->fd, $user);

        $server->push($request->fd, json_encode(
                array_merge(['user' => $user], ['all' => $this->allUser()], ['type' => 'openSuccess'])
            )
        );
        $this->pushMessage($server, "欢迎".$user['name']."进入聊天室", 'open', $request->fd);
    }

    private function allUser()
    {
        $users = [];
        foreach ($this->table as $row) {
            $users[] = $row;
        }
        return $users;
    }

    /**
     * @param Server $server
     * @param $frame
     */
    public function message(Server $server, $frame)
    {
        $this->pushMessage($server, $frame->data, 'message', $frame->fd);
    }


    /**
     * @param Server $server
     * @param $fd
     */
    public function close(Server $server, $fd)
    {
        $user = $this->table->get($fd);
        $this->pushMessage($server, $user['name']."离开聊天室", 'close', $fd);
        $this->table->del($fd);
    }

    /**
     * 遍历发送消息
     *
     * @param Server $server
     * @param $message
     * @param $messageType
     * @param int $skip
     */
    private function pushMessage(Server $server, $message, $messageType, $frameFd)
    {
        $message = htmlspecialchars($message);
        $datetime = date('Y-m-d H:i:s', time());
        $user = $this->table->get($frameFd);
        foreach ($this->table as $row) {
            if ($frameFd == $row['fd']) {
                continue;
            }
            $server->push($row['fd'], json_encode([
                    'type' => $messageType,
                    'message' => $message,
                    'datetime' => $datetime,
                    'user' => $user
                ])
            );
        }
    }

    /**
     * 创建内存表
     */
    private function createTable()
    {
        $this->table = new \swoole_table(1024);
        $this->table->column('fd', \swoole_table::TYPE_INT);
        $this->table->column('name', \swoole_table::TYPE_STRING, 255);
        $this->table->column('avatar', \swoole_table::TYPE_STRING, 255);
        $this->table->create();
    }
}