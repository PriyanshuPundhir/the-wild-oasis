import { getToday } from "../utils/helpers";
import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";
import { format } from "date-fns";

export async function getBookings({ filter, sortBy, page }) {
  console.log("page", page);
  let query = supabase
    .from("bookings")
    .select(
      "id,created_at , startDate,endDate,numNights,numGuests,status,totalPrice,cabins(name) , guests(fullName, email)",
      { count: "exact" }
    );

  // FILTER
  if (filter) query = query.eq(filter.field, filter.value);

  // SORT
  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  //PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    console.log("from to ", from, " - ", to);
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error("Bookings could not be loaded");
  }
  return { data, count };
}

export async function getBooking(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("Booking not found");
  }

  return data;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    .select("created_at, totalPrice, extrasPrice")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }));

  if (error) {
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date) {
  const { data, error } = await supabase
    .from("bookings")
    // .select('*')
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  // const { data, error } = await supabase
  //   .from("bookings")
  //   .select("*, guests(fullName, nationality, countryFlag)")
  //   .or(
  //     `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
  //   )
  //   .order("created_at");

  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .in("status", ["unconfirmed", "checked-in"])
    .order("created_at");

  const today = getToday();

  const filteredData = data?.filter((booking) => {
    // const startDate = new Date(booking.startDate).toISOString().split("T")[0];
    const todayDate = new Date(today).toISOString().split("T")[0];
    // const endDate = new Date(booking.endDate).toISOString().split("T")[0];

    const parsedDate = new Date(booking.startDate);
    const startDate = format(parsedDate, "yyyy-MM-dd");

    const parsedDateEnd = new Date(booking.endDate);
    const endDate = format(parsedDateEnd, "yyyy-MM-dd");

    console.log("startDate", startDate);
    console.log("todayDate", todayDate);
    console.log("endDate", endDate);

    if (startDate === todayDate || endDate === todayDate) {
      console.log("same date");
      console.log("booking.status", booking.status);
      console.log("startDate", startDate);
      console.log("todayDate", todayDate);
      console.log("endDate", endDate);
    }

    return (
      (booking.status === "unconfirmed" && startDate === todayDate) ||
      (booking.status === "checked-in" && endDate === todayDate)
    );
  });

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    throw new Error("Bookings could not get loaded");
  }
  return filteredData;
}

export async function updateBooking(id, obj) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    throw new Error("Booking could not be deleted");
  }
  return data;
}
