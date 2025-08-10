package com.ticketez_backend_springboot.modules.eventDiscount;

import com.ticketez_backend_springboot.modules.discount.Discount;
import com.ticketez_backend_springboot.modules.event.Event;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Events_Discounts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDiscount {
    @EmbeddedId
    EventDiscountPK eventDiscountPK;
    @ManyToOne
    @JoinColumn(name = "event_id", insertable = false, updatable = false)
    private Event event;

    @ManyToOne
    @JoinColumn(name = "discount_id", insertable = false, updatable = false)
    private Discount discount;
}
