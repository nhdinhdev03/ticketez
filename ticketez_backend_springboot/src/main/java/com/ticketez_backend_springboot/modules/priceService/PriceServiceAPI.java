package com.ticketez_backend_springboot.modules.priceService;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ticketez_backend_springboot.dto.ResponseDTO;
import com.ticketez_backend_springboot.modules.price.Price;
import com.ticketez_backend_springboot.modules.service.Service;
import com.ticketez_backend_springboot.modules.service.ServiceDAO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/priceService")
public class PriceServiceAPI {

	@Autowired
	private PriceServiceDAO dao;

	@GetMapping
	public ResponseEntity<?> findByPage(@RequestParam("page") Optional<Integer> pageNo,
			@RequestParam("limit") Optional<Integer> limit) {
		try {

			if (pageNo.isPresent() && pageNo.get() == 0) {
				return new ResponseEntity<>("Trang không tồn tại", HttpStatus.NOT_FOUND);
			}
			Sort sort = Sort.by(Sort.Order.desc("id"));
			Pageable pageable = PageRequest.of(pageNo.orElse(1) - 1, limit.orElse(10), sort);
			Page<PriceService> page = dao.findAll(pageable);
			ResponseDTO<PriceService> responseDTO = new ResponseDTO<>();
			responseDTO.setData(page.getContent());
			responseDTO.setTotalItems(page.getTotalElements());
			responseDTO.setTotalPages(page.getTotalPages());
			return ResponseEntity.ok(responseDTO);
		} catch (Exception e) {
			return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/get/all")
	public ResponseEntity<List<PriceService>> findAll() {
		List<PriceService> priceServices = dao.findAllByOrderByIdDesc();
		return ResponseEntity.ok(priceServices);
	}

	@GetMapping("/{id}")
	public ResponseEntity<PriceService> getOne(@PathVariable("id") Long id) {
		Optional<PriceService> priceServiceOptional = dao.findById(id);
		if (priceServiceOptional.isPresent()) {
			return ResponseEntity.ok(priceServiceOptional.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PostMapping
	public ResponseEntity<?> post(@RequestBody PriceService priceService) {
		try {
			dao.save(priceService);
			return ResponseEntity.ok(priceService);
		} catch (Exception e) {
			return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@Autowired
	ServiceDAO serviceDAO;

	@GetMapping("/find-by-cinema-complex/{idCplx}")
	public ResponseEntity<?> findByCplx(@PathVariable("idCplx") Long idCplx) {
		try {

			List<Service> services = serviceDAO.findByCinemaComplexId(idCplx);
			List<Long> serviceIds = new ArrayList<>();
			// System.out.println("services" + services.size());
			for (Service service : services) {
				// System.out.println("-------------------------idCplx1" + idCplx);

				System.out.println("--------------------" + service.getId());
				serviceIds.add(service.getId());
				// System.out.println("-------------------------serviceIds" + idCplx);
			}
			List<PriceService> priceServices = dao.findByCplxAndService(serviceIds);
			if (priceServices.isEmpty()) {
				return new ResponseEntity<>("Không tìm thấy giá dịch vụ!", HttpStatus.INTERNAL_SERVER_ERROR);
			}
			// List<PriceServiceDTO> priceServiceDTOs = new ArrayList<>();
			// for (Service service : services) {
			// for (PriceService priceService : priceServices) {
			// if (priceService.getService().getId() == service.getId()) {
			// PriceServiceDTO priceServiceDTO = new PriceServiceDTO();
			// priceServiceDTO.setPrice(priceService);
			// priceServiceDTO.setService(service);
			// priceServiceDTOs.add(priceServiceDTO);
			// }
			// }

			// }
			return ResponseEntity.ok(priceServices);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(" Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@PutMapping("/{id}")
	public ResponseEntity<?> put(@PathVariable("id") Long id, @RequestBody PriceService priceService) {
		try {
			if (!dao.existsById(id)) {
				return new ResponseEntity<>("dịch vụ không tồn tại", HttpStatus.NOT_FOUND);
			}
			dao.save(priceService);
			return ResponseEntity.ok(priceService);
		} catch (Exception e) {
			return new ResponseEntity<>("Server error, vui lòng thử lại sau!", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") Long id) {
		try {
			dao.deleteById(id);
			return ResponseEntity.ok().build();
		} catch (DataIntegrityViolationException e) {
			return new ResponseEntity<>("Không thể xóa dịch vụ do tài liệu tham khảo hiện có", HttpStatus.CONFLICT);
		}

	}
}
