"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Loader2, Calendar, Clock, MapPin, Activity, Mail, Users, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import LocationSearch from "@/components/location-search";
import VenueRecommendations from "@/components/venue-recommendations";
import { cn } from "@/lib/utils";
import { planHelpers } from "@/lib/supabase";

const steps = [
  { id: "basics", title: "Event Basics", icon: Calendar },
  { id: "location", title: "Location", icon: MapPin },
  { id: "details", title: "Details", icon: Activity },
  { id: "invites", title: "Invite Guests", icon: Mail },
  { id: "review", title: "Review", icon: Check },
];

// Brand color
const brandColor = "#ffb829";

interface EventFormData {
  // Basic Info
  eventName: string;
  eventDate: string;
  eventTime: string;
  eventVibe: string;
  
  // Location
  location: google.maps.places.PlaceResult | null;
  locationName: string;
  locationAddress: string;
  locationLat: number;
  locationLng: number;
  
  // Details
  eventDescription: string;
  eventAgenda: string;
  
  // Invitations
  invites: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
  }>;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const contentVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
};

export function CreateEventWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  
  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventDate: "",
    eventTime: "",
    eventVibe: "",
    location: null,
    locationName: "",
    locationAddress: "",
    locationLat: 0,
    locationLng: 0,
    eventDescription: "",
    eventAgenda: "",
    invites: [],
  });

  const updateFormData = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const [useManualLocation, setUseManualLocation] = useState(false);

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Basics
        return formData.eventName.trim() !== "" && 
               formData.eventDate !== "" && 
               formData.eventTime !== "";
      case 1: // Location
        return formData.locationName.trim() !== "" && formData.locationAddress.trim() !== "";
      case 2: // Details
        return true; // Optional step
      case 3: // Invites
        return true; // Optional step
      case 4: // Review
        return true;
      default:
        return true;
    }
  };

  const handleLocationSelect = (place: any) => {
    if (place.geometry?.location && place.formatted_address && place.name) {
      // Handle both old and new Google Places API response formats
      const lat = typeof place.geometry.location.lat === 'function' 
        ? place.geometry.location.lat() 
        : place.geometry.location.lat;
      const lng = typeof place.geometry.location.lng === 'function' 
        ? place.geometry.location.lng() 
        : place.geometry.location.lng;
      
      setFormData(prev => ({
        ...prev,
        location: place,
        locationName: place.name,
        locationAddress: place.formatted_address,
        locationLat: lat,
        locationLng: lng,
      }));
    }
  };


  const addInvite = () => {
    const newInvite = {
      id: Date.now().toString(),
      name: "",
      email: "",
      phone: "",
    };
    setFormData(prev => ({
      ...prev,
      invites: [...prev.invites, newInvite],
    }));
  };

  const updateInvite = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      invites: prev.invites.map(invite =>
        invite.id === id ? { ...invite, [field]: value } : invite
      ),
    }));
  };

  const removeInvite = (id: string) => {
    setFormData(prev => ({
      ...prev,
      invites: prev.invites.filter(i => i.id !== id),
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate share code
      const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Try to save to database first
      try {
        const planData = {
          name: formData.eventName,
          date: formData.eventDate,
          time: formData.eventTime,
          activity_type: formData.eventVibe,
          share_code: shareCode,
          location_name: formData.locationName,
          location_address: formData.locationAddress,
          description: formData.eventDescription,
        };
        
        await planHelpers.createPlan(planData);
        console.log('✅ Event saved to database');
        
      } catch (dbError) {
        console.log('⚠️ Database save failed, using localStorage fallback');
        
        // Fallback to localStorage
        const planData = {
          id: shareCode,
          name: formData.eventName,
          date: formData.eventDate,
          time: formData.eventTime,
          vibe: formData.eventVibe,
          location: formData.locationName,
          address: formData.locationAddress,
          lat: formData.locationLat,
          lng: formData.locationLng,
          description: formData.eventDescription,
          agenda: formData.eventAgenda,
          createdAt: new Date().toISOString(),
          creator: 'Anonymous', // Would come from auth
        };
        
        const existingPlans = localStorage.getItem('plans');
        const plans = existingPlans ? JSON.parse(existingPlans) : [];
        plans.push(planData);
        localStorage.setItem('plans', JSON.stringify(plans));
      }
      
      // Send invitations if provided
      if (formData.invites.length > 0) {
        // Format emails and phones for sending
        const emails = formData.invites
          .filter(i => i.email)
          .map(i => i.email)
          .join(',');
        const phones = formData.invites
          .filter(i => i.phone)
          .map(i => i.phone)
          .join(',');
        
        // TODO: Send invitations via API
      }
      
      setToastMessage("Plan created successfully!");
      setShowToast(true);
      
      // Redirect to join page
      setTimeout(() => {
        router.push(`/join/${shareCode}`);
      }, 1500);
      
    } catch (error) {
      console.error('Error creating plan:', error);
      setToastMessage("Error creating plan. Please try again.");
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      {/* Progress indicator */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                className="flex flex-col items-center flex-1"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                    index < currentStep
                      ? "text-white"
                      : index === currentStep
                        ? "text-white ring-4"
                        : "bg-muted text-muted-foreground",
                  )}
                  style={{
                    backgroundColor: index <= currentStep ? brandColor : undefined,
                    boxShadow: index === currentStep ? `0 0 0 4px ${brandColor}33` : undefined,
                  }}
                  onClick={() => {
                    if (index < currentStep) {
                      setCurrentStep(index);
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.div>
                <motion.span
                  className={cn(
                    "text-xs mt-2 font-medium",
                    index === currentStep
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
        <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: brandColor }}
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>

      {/* Form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-2 shadow-xl">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (isStepValid()) {
              if (currentStep === steps.length - 1) {
                handleSubmit();
              } else {
                nextStep();
              }
            }
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={contentVariants}
              >
              {/* Step 1: Event Basics */}
              {currentStep === 0 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl">Let's plan something awesome!</CardTitle>
                    <CardDescription>
                      Start with the basic details of your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="eventName">What are you planning?</Label>
                      <Input
                        id="eventName"
                        placeholder="Birthday party, team lunch, game night..."
                        value={formData.eventName}
                        onChange={(e) => updateFormData("eventName", e.target.value)}
                        className="text-lg"
                      />
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="eventDate">When is it?</Label>
                        <Input
                          id="eventDate"
                          type="date"
                          min={today}
                          value={formData.eventDate}
                          onChange={(e) => updateFormData("eventDate", e.target.value)}
                        />
                      </motion.div>
                      
                      <motion.div variants={fadeInUp} className="space-y-2">
                        <Label htmlFor="eventTime">What time?</Label>
                        <Input
                          id="eventTime"
                          type="time"
                          value={formData.eventTime}
                          onChange={(e) => updateFormData("eventTime", e.target.value)}
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="eventVibe">What's the vibe? (optional)</Label>
                      <Input
                        id="eventVibe"
                        placeholder="Casual hangout, formal dinner, outdoor adventure..."
                        value={formData.eventVibe}
                        onChange={(e) => updateFormData("eventVibe", e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground">
                        This helps us suggest the perfect venues for your event
                      </p>
                    </motion.div>
                  </CardContent>
                </>
              )}

              {/* Step 2: Location */}
              {currentStep === 1 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl">Where's it happening?</CardTitle>
                    <CardDescription>
                      Search for a venue, browse recommendations, or enter manually
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div variants={fadeInUp} className="space-y-4">
                      {!useManualLocation ? (
                        <>
                          <LocationSearch 
                            onLocationSelect={handleLocationSelect}
                            activityType={formData.eventVibe}
                          />
                          
                          {/* Show venue recommendations after location is selected */}
                          {formData.locationName && formData.locationAddress && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-6"
                            >
                              <VenueRecommendations
                                location={{
                                  lat: formData.locationLat,
                                  lng: formData.locationLng,
                                  name: formData.locationName
                                }}
                                activityType={formData.eventVibe || "dinner"}
                                onVenueSelect={(venue) => {
                                  if (confirm(`Use "${venue.name}" as your venue location?`)) {
                                    setFormData(prev => ({
                                      ...prev,
                                      locationName: venue.name,
                                      locationAddress: venue.formatted_address,
                                      locationLat: venue.geometry.location.lat,
                                      locationLng: venue.geometry.location.lng,
                                    }));
                                  }
                                }}
                              />
                            </motion.div>
                          )}
                          
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setUseManualLocation(true)}
                            className="text-sm"
                            style={{ color: brandColor }}
                          >
                            Can't find your location? Enter it manually
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="manualLocationName">Location Name</Label>
                              <Input
                                id="manualLocationName"
                                placeholder="Joe's House, Central Park, etc."
                                value={formData.locationName}
                                onChange={(e) => updateFormData("locationName", e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="manualLocationAddress">Address</Label>
                              <Textarea
                                id="manualLocationAddress"
                                placeholder="123 Main St, New York, NY 10001"
                                value={formData.locationAddress}
                                onChange={(e) => updateFormData("locationAddress", e.target.value)}
                                className="min-h-[80px]"
                              />
                            </div>
                          </div>
                          
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => {
                              setUseManualLocation(false);
                              // Clear manual entries
                              updateFormData("locationName", "");
                              updateFormData("locationAddress", "");
                            }}
                            className="text-sm"
                            style={{ color: brandColor }}
                          >
                            Back to search
                          </Button>
                        </>
                      )}
                      
                      {formData.locationName && formData.locationAddress && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 bg-muted rounded-lg"
                        >
                          <h4 className="font-semibold text-lg">{formData.locationName}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formData.locationAddress}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  </CardContent>
                </>
              )}

              {/* Step 3: Details */}
              {currentStep === 2 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl">Event Details (Optional)</CardTitle>
                    <CardDescription>
                      Add any additional information about your event
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="eventDescription">Description</Label>
                      <Textarea
                        id="eventDescription"
                        placeholder="Tell people what this event is about..."
                        value={formData.eventDescription}
                        onChange={(e) => updateFormData("eventDescription", e.target.value)}
                        className="min-h-[100px]"
                      />
                      <p className="text-sm text-muted-foreground">
                        Help guests understand what to expect
                      </p>
                    </motion.div>
                    
                    <motion.div variants={fadeInUp} className="space-y-2">
                      <Label htmlFor="eventAgenda">Agenda or Schedule (Optional)</Label>
                      <Textarea
                        id="eventAgenda"
                        placeholder="6:00 PM - Arrival&#10;6:30 PM - Dinner&#10;8:00 PM - Games&#10;9:30 PM - Dessert"
                        value={formData.eventAgenda}
                        onChange={(e) => updateFormData("eventAgenda", e.target.value)}
                        className="min-h-[120px] font-mono text-sm"
                      />
                      <p className="text-sm text-muted-foreground">
                        Add a simple timeline if you have one planned
                      </p>
                    </motion.div>
                  </CardContent>
                </>
              )}

              {/* Step 4: Invitations */}
              {currentStep === 3 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl">Invite Friends (Optional)</CardTitle>
                    <CardDescription>
                      Add people you'd like to invite - we'll send them the details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div variants={fadeInUp} className="space-y-4">
                      {formData.invites.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No invites added yet</p>
                          <p className="text-sm mt-2">Click below to add people to invite</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {formData.invites.map((invite, index) => (
                            <motion.div
                              key={invite.id}
                              variants={fadeInUp}
                              className="flex gap-2 items-start"
                            >
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                <Input
                                  placeholder="Name"
                                  value={invite.name}
                                  onChange={(e) => updateInvite(invite.id, "name", e.target.value)}
                                />
                                <Input
                                  type="email"
                                  placeholder="Email (optional)"
                                  value={invite.email}
                                  onChange={(e) => updateInvite(invite.id, "email", e.target.value)}
                                />
                                <Input
                                  type="tel"
                                  placeholder="Phone (optional)"
                                  value={invite.phone}
                                  onChange={(e) => updateInvite(invite.id, "phone", e.target.value)}
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeInvite(invite.id)}
                                className="mt-1"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addInvite}
                        className="w-full"
                        style={{ borderColor: brandColor, color: brandColor }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Someone
                      </Button>
                    </motion.div>
                  </CardContent>
                </>
              )}

              {/* Step 5: Review */}
              {currentStep === 4 && (
                <>
                  <CardHeader>
                    <CardTitle className="text-2xl">Almost there!</CardTitle>
                    <CardDescription>
                      Review your event details before creating
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div variants={fadeInUp} className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg space-y-3">
                        <h3 className="font-semibold text-lg">{formData.eventName}</h3>
                        {formData.eventVibe && (
                          <p className="text-sm italic text-muted-foreground">
                            {formData.eventVibe}
                          </p>
                        )}
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(formData.eventDate).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {new Date(`2000-01-01T${formData.eventTime}`).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                              })}
                            </span>
                          </div>
                          
                          {formData.locationName && (
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="font-medium">{formData.locationName}</p>
                                <p className="text-muted-foreground">{formData.locationAddress}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {(formData.eventDescription || formData.eventAgenda) && (
                          <div className="pt-2 border-t space-y-2">
                            {formData.eventDescription && (
                              <div>
                                <p className="font-medium mb-1">Description:</p>
                                <p className="text-sm text-muted-foreground">{formData.eventDescription}</p>
                              </div>
                            )}
                            {formData.eventAgenda && (
                              <div>
                                <p className="font-medium mb-1">Agenda:</p>
                                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">{formData.eventAgenda}</pre>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {formData.invites.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="font-medium mb-2">Inviting:</p>
                            <ul className="space-y-1">
                              {formData.invites.map((invite, index) => (
                                <li key={index} className="text-sm">
                                  • {invite.name}
                                  {invite.email && <span className="text-muted-foreground"> ({invite.email})</span>}
                                  {invite.phone && !invite.email && <span className="text-muted-foreground"> ({invite.phone})</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </CardContent>
                </>
              )}
              </motion.div>
            </AnimatePresence>

            <CardFooter className="flex justify-between pt-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  type="submit"
                  disabled={!isStepValid() || isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    <>
                      {currentStep === steps.length - 1 ? "Create Event" : "Next"}
                      {currentStep === steps.length - 1 ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>

      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}