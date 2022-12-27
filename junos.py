#!/usr/bin/python
 
from paramiko import SSHClient
import paramiko

import sys
metodo = sys.argv[1]
login = sys.argv[2]

hostname = sys.argv[3]
port = sys.argv[4]
username = sys.argv[5]
password = sys.argv[6]


if metodo == "nat":
    COMANDO = "show services sessions source-prefix "+login+" count "
elif metodo == "int":
    COMANDO = "show subscribers user-name "+login+" | match pp0 "
elif metodo == "natspy":
    COMANDO = "show services sessions source-prefix "+login+" | no-more"
else:
    COMANDO = "show interfaces "+login+" extensive | match bps "

 
class SSH:
    def __init__(self):
        self.ssh = SSHClient()
        self.ssh.load_system_host_keys()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(hostname=hostname,port=port,username=username,password=password)
 
    def exec_cmd(self,cmd):
        stdin,stdout,stderr = self.ssh.exec_command(cmd)
        if stderr.channel.recv_exit_status() != 0:
            print stderr.read()
        else:
            print stdout.read()
 
if __name__ == '__main__':
    ssh = SSH()
    ssh.exec_cmd(COMANDO)