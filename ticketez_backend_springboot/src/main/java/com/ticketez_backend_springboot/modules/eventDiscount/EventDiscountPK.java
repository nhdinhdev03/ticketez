package com.ticketez_backend_springboot.modules.eventDiscount;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class EventDiscountPK {

    @Column(name = "event_id", insertable = false, updatable = false)
    private Long EventId;

    @Column(name = "discount_id", insertable = false, updatable = false)
    private Long discountId;
}
