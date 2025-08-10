package com.ticketez_backend_springboot.modules.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class main {

	@RequestMapping("/index")
	public String index() {
		return "/index";
	}

	@RequestMapping("/details-movie")
	public String details() {
		return "/views/details-movie";
	}
	
	@RequestMapping("/more-movie")
	public String more() {
		return "/views/more-movies";
	}
}
