#!/bin/bash

set -e

echoGreen() {
	echo -e "\n\033[32m $1\033[0m"
}

key() {
	if [ -e ${HOME}/.ssh/id_rsa.pub ]; then
		echoGreen "* ssh-key已存在"
  	cat ${HOME}/.ssh/id_rsa.pub
	else
		echoGreen "* 创建密钥，请输入git用户名和邮箱"
		echoGreen "* 输入用户名:" && read -p" 👨 " username && echoGreen "* 输入邮箱:" && read -p" 📮 " email
		echoGreen "* 即将创建密钥，请根据提示进行操作"
		git config --global user.name "$username" && git config --global user.email "$email" && ssh-keygen -t rsa -C "$email"
		echoGreen "* ssh-key创建完成"
		cat ${HOME}/.ssh/id_rsa.pub
	fi
}

# 不支持
notSupported() { 
  echo -e "\033[31m\n ! 目前不支持该发行版系统 ! \033[0m" 
}

# 欢迎语
welecom() {
	echoGreen "* Eltos前端环境部署脚本"
	echoGreen "* 使用系统包管理工具安装 Node.js、Nginx、ZSH、OhMyZsh，默认安装lasted版本\n * https://github.com/vhhgx/common/ 欢迎star\n"
	
	read -p ' * 敲击回车继续' isContinue
}

node() {
	curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt-get update
	sudo apt install -y nodejs
}

nginx() {
	sudo add-apt-repository -y ppa:nginx/stable && sudo apt-get update
	sudo apt-get install -y nginx
}

npmTaobao() {
	registry.npmmirror.com 
	sudo npm config set registry https://registry.npmmirror.com --global
	sudo npm config set disturl https://npmmirror.com/dist --global
}

# deb安装zsh
zsh() {
	sudo apt -y install zsh && chsh -s /bin/zsh
}

omz() {
	wget https://cdn.jsdelivr.net/gh/vhhgx/common/libraies/script/omz-gitee.sh && sudo bash omz-gitee.sh
}

all() {
	if [[ "$OSTYPE" == "linux-gnu" && -f /etc/redhat-release ]]; then
		# echoRed "红帽，暂不支持"
		notSupported
	elif [[ "$OSTYPE" == "linux-gnu" && -f /etc/debian_version ]]; then
		welecom
		key
		# 安装系统必备包
		sudo apt install -y software-properties-common curl wget git net-tools openssh-server
		node
		nginx
		npmTaobao
		zsh
		omz
	elif [[ "$OSTYPE" == "darwin"* ]]; then
		# echoRed "mac，暂不支持"
		notSupported
	else
		# echoRed " ! 目前不支持该发行版系统 ! "
		notSupported
	fi
}

# ----------------------------------------------- 脚本开始 -----------------------------------------------

case $1 in
	key)
		key;;
	node)
		node;;
	nginx)
		nginx;;
	taobao)
		npmTaobao;;
	zsh)
		zsh;;
	omz)
		omz;;
	*)
		all;;
esac
