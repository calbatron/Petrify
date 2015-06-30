# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|

  
  config.vm.box = "smallhadroncollider/centos-6.5-lamp"
  config.vm.network "forwarded_port", guest: 80, host: 8058
  config.vm.network "private_network", ip: "192.168.192.58"
  config.vm.synced_folder '.', '/vagrant', disabled: true
  config.vm.synced_folder "./", "/var/www/public"

  config.vm.provider "virtualbox" do |vb|
    vb.name = "petrify-01"
  end

#

end
